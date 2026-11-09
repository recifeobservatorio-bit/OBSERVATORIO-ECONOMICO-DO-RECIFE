// Como numa página de Power BI, os visuais de uma linha ocupam a largura
// inteira do painel. Nas grades do Tailwind com número fixo de colunas,
// quando a quantidade de cards não é múltipla das colunas (ex.: 7 gráficos em
// 4 colunas) sobra um buraco no fim da última linha — e numa grade de 2
// colunas com só uma tabela (comparativo sem município escolhido) a tabela
// fica com meia largura. Aqui os cards da última linha de cada grade são
// esticados (grid-column: span N) até fecharem a linha.

// Marca os elementos que esticamos, pra desfazer antes de medir de novo.
const MARK = "biSpan";

// Só mexe em grades de painel — as que contêm card de gráfico, tabela ou KPI.
// Isso deixa de fora grades de controles (ex.: o seletor Mês/Ano).
const PANEL_CONTENT = ".chart-content-wrapper, .bi-table, .bi-kpi";

const isVisible = (el: HTMLElement) => el.offsetParent !== null && getComputedStyle(el).display !== "none";

export function resetGridGaps(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-bi-span]").forEach((el) => {
    el.style.gridColumn = el.dataset[MARK] === "-" ? "" : el.dataset[MARK]!;
    delete el.dataset[MARK];
  });
}

export function fillGridGaps(root: HTMLElement) {
  resetGridGaps(root);

  root.querySelectorAll<HTMLElement>("*").forEach((grid) => {
    const style = getComputedStyle(grid);
    if (style.display !== "grid") return;
    if (!grid.querySelector(PANEL_CONTENT)) return;

    // auto-fit deixa trilhas vazias com 0px — essas não contam como colunas.
    const tracks = style.gridTemplateColumns
      .split(" ")
      .map((t) => parseFloat(t))
      .filter((w) => w > 0.5);
    const cols = tracks.length;
    if (cols < 2) return;

    const items = Array.from(grid.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && isVisible(el)
    );
    if (!items.length) return;

    // A última linha = os itens com o maior topo. Medido em px de layout
    // (getBoundingClientRect inclui a escala do FitToScreen, mas ela afeta
    // tudo por igual, então só a proporção importa).
    const rects = items.map((el) => el.getBoundingClientRect());
    const lastTop = Math.max(...rects.map((r) => r.top));
    const lastRowIdx = items.map((_, i) => i).filter((i) => Math.abs(rects[i].top - lastTop) < 2);
    const lastRow = lastRowIdx.map((i) => items[i]);

    const gridWidth = grid.getBoundingClientRect().width;
    const gap = parseFloat(style.columnGap) || 0;
    const scale = gridWidth / (grid.clientWidth || gridWidth);
    const colWidth = (gridWidth / scale - gap * (cols - 1)) / cols;
    const spanOf = (r: DOMRect) => Math.max(1, Math.round((r.width / scale + gap) / (colWidth + gap)));

    const spans = lastRowIdx.map((i) => spanOf(rects[i]));
    // Colunas já tomadas na última linha: os itens que começam nela e também
    // os que vêm de cima ocupando várias linhas (row-span) e descem até ela —
    // sem contar esses, um card "esticado" quebraria pra uma linha nova.
    const occupied = items.reduce(
      (sum, _, i) => (rects[i].top <= lastTop + 1 && rects[i].bottom > lastTop + 2 ? sum + spanOf(rects[i]) : sum),
      0
    );
    const free = cols - occupied;
    if (free <= 0) return;

    // Divide as colunas que sobraram entre os itens da linha; o resto vai
    // para os últimos (ex.: 3 itens em 5 colunas → 2, 2, 1 vira 1, 2, 2).
    const each = Math.floor(free / lastRow.length);
    let remainder = free % lastRow.length;
    for (let i = lastRow.length - 1; i >= 0; i--) {
      const extra = each + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;
      if (!extra) continue;
      const el = lastRow[i];
      el.dataset[MARK] = el.style.gridColumn || "-";
      el.style.gridColumn = `span ${spans[i] + extra} / span ${spans[i] + extra}`;
    }

    // Trava: se algum card desceu de linha (layout que a conta não previu,
    // ex.: posições explícitas), desfaz nesta grade.
    if (lastRow.some((el) => el.getBoundingClientRect().top > lastTop + 2)) {
      lastRow.forEach((el) => {
        if (!(MARK in el.dataset)) return;
        el.style.gridColumn = el.dataset[MARK] === "-" ? "" : el.dataset[MARK]!;
        delete el.dataset[MARK];
      });
    }
  });
}
