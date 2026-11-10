"use client";

import { useEffect, useRef, useState } from "react";

import { fillGridGaps } from "./fillGridGaps";

// Abaixo disso (celular e tablet em pé) o layout "cabe tudo numa tela" vira
// espremido demais pra ler — nessa faixa a página volta a rolar normalmente,
// com os gráficos empilhados em tamanho legível. Casa com o breakpoint `lg`
// do Tailwind, que também controla o número de colunas dos grids de gráfico.
const COMPACT_BREAKPOINT = 1024;

// Quase tela única (como o Power BI): cada aba rola no máximo SCROLL_ALLOWANCE
// da altura da janela. O encaixe vem primeiro da
// altura dos gráficos (--bi-chart-h, entre MIN_CHART_H e MAX_CHART_H) e do CSS
// .bi-fit enxuto (sem legenda de série única, títulos/eixos compactos). Só se
// ainda não couber a página encolhe — no máximo até 70%, pra o texto continuar
// legível (com 0.5 tudo ficava miúdo e "comprimido").
const MIN_SCALE = 0.7;

// Folga de rolagem: a página pode passar da tela em até esta fração da altura
// da janela (pedido do usuário: "poder rolar, um scroll pequeno"). Os
// gráficos usam esse espaço extra e ficam menos espremidos; com 0 a aba volta
// a caber exata, sem rolar.
const SCROLL_ALLOWANCE = 0.15;

// Faixa de altura que os gráficos (.bi-chart-box) podem assumir ao preencher a
// tela. Abaixo do mínimo eixos e rótulos não cabem; acima do máximo o gráfico
// só fica esticado sem mostrar nada a mais.
const MIN_CHART_H = 150;
const MAX_CHART_H = 460;

// Tela em pé larga o bastante pro modo "tela única" (ex.: painel/TV vertical
// 1080×1920): com o teto de 460px os gráficos ocupavam só ~40% da altura e o
// resto do painel ficava vazio. Nessa orientação o teto acompanha a altura da
// tela, e não há folga de rolagem — num painel ninguém rola a página.
const isPortrait = () => window.innerHeight > window.innerWidth;
const maxChartHeight = () =>
  isPortrait() ? Math.max(MAX_CHART_H, Math.round(window.innerHeight * 0.4)) : MAX_CHART_H;
const scrollAllowance = () => (isPortrait() ? 0 : SCROLL_ALLOWANCE);
// Trava de segurança contra ajustes em loop (cada ajuste muda o layout e
// dispara uma nova medição).
const MAX_FILL_PASSES = 12;
// Fração da diferença corrigida por passo e espera entre passos (ver compute).
const FILL_DAMPING = 0.5;
const FILL_SETTLE_MS = 250;

// Quanto a área de rolagem do painel (.bi-canvas, overflow-y-auto) já rolou.
const scrollOffset = (el: HTMLElement) =>
  (el.closest(".overflow-y-auto") as HTMLElement | null)?.scrollTop ?? 0;

/**
 * Encolhe (nunca amplia) o conteúdo filho na ALTURA para caber na tela
 * visível sem precisar rolar. A largura é sempre compensada para preencher
 * 100% do container (de ponta a ponta), mesmo depois do encolhimento —
 * por isso o conteúdo é renderizado numa largura virtual maior
 * (`100/scale`%) e depois escalado de volta para caber exatamente.
 * Mede a altura natural do conteúdo via ResizeObserver (reage a gráficos
 * que carregam de forma assíncrona).
 *
 * Em telas estreitas (< COMPACT_BREAKPOINT) essa lógica é desativada: o
 * conteúdo renderiza no fluxo normal, em tamanho real, e a página pode
 * rolar — celular/tablet em pé não tem espaço pra manter tudo numa tela só
 * de forma legível.
 */
const FitToScreen = ({
  children,
  bottomOffset = 16,
}: {
  children: React.ReactNode;
  bottomOffset?: number;
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [topOffset, setTopOffset] = useState(0);
  const topOffsetRef = useRef(0);
  const scaleRef = useRef(1);
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== "undefined" && window.innerWidth < COMPACT_BREAKPOINT
  );

  // Só decide se está no modo compacto (celular/tablet em pé) — roda sempre,
  // independente do modo atual, pra pegar a transição em qualquer direção.
  useEffect(() => {
    const checkCompact = () => setIsCompact(window.innerWidth < COMPACT_BREAKPOINT);
    checkCompact();
    window.addEventListener("resize", checkCompact);
    return () => window.removeEventListener("resize", checkCompact);
  }, []);

  // Recalcula a escala apenas no modo não-compacto. Reatacha o
  // ResizeObserver sempre que `isCompact` muda pra `false`, já que o div
  // observado só existe (é montado) nesse modo.
  useEffect(() => {
    if (isCompact) return;

    let debounceId: number | undefined;
    let settleId: number | undefined;
    let fillPasses = 0;

    // Trava anti-oscilação: em algumas abas a altura do conteúdo depende da
    // própria escala (escala menor = largura virtual maior = KPIs/legendas
    // quebram diferente). Isso podia virar um ciclo sem fim (0,87 ↔ 1,0) e a
    // tela piscava/cortava. Se escala ou altura dos gráficos mudarem mais de
    // OSC_LIMIT vezes em OSC_WINDOW_MS, trava: altura dos gráficos e escala
    // só podem DIMINUIR até caber (sempre termina). Redimensionar a janela solta.
    const OSC_WINDOW_MS = 6000;
    const OSC_LIMIT = 6;
    let changeTimes: number[] = [];
    let locked = false;
    // A 1ª trava é temporária: durante o carregamento a página muda de tamanho
    // muitas vezes (esqueletos → dados) e isso também conta como "oscilação".
    // Se a trava ficasse, os gráficos podiam ficar presos no mínimo com espaço
    // sobrando (ex.: Balança Comercial). Ela solta após OSC_WINDOW_MS e o ajuste
    // roda de novo com os dados já na tela; se oscilar outra vez, a 2ª trava
    // fica até a janela ser redimensionada.
    let lockCount = 0;
    let unlockTimer: number | undefined;
    const noteChange = () => {
      const now = Date.now();
      changeTimes = changeTimes.filter((t) => now - t < OSC_WINDOW_MS);
      changeTimes.push(now);
      if (changeTimes.length > OSC_LIMIT && !locked) {
        locked = true;
        lockCount += 1;
        if (lockCount === 1) {
          unlockTimer = window.setTimeout(() => {
            locked = false;
      lockCount = 0;
      if (unlockTimer) window.clearTimeout(unlockTimer);
            changeTimes = [];
            fillPasses = 0;
            compute();
          }, OSC_WINDOW_MS);
        }
      }
    };

    const compute = () => {
      const inner = innerRef.current;
      const outer = outerRef.current;
      if (!inner || !outer) return;

      // Fecha os buracos da última linha das grades antes de medir — esticar
      // um card pode mudar a altura dele (legenda quebra menos).
      fillGridGaps(inner);

      const contentHeight = inner.scrollHeight;
      if (!contentHeight) return;

      // A Navbar (irmã anterior, sticky) anima sua altura com
      // transition-all duration-700 ao abrir/fechar o painel de filtros,
      // usando um truque de margem negativa fixa — em telas menores ou com
      // a Navbar no estado colapsado, essa margem pode superar a altura
      // real da Navbar e empurrar este wrapper para uma posição ACIMA do
      // topo da tela (`top` negativo). Isso (a) infla `availableHeight`
      // artificialmente, relaxando a escala achando que sobra espaço, e (b)
      // esconde uma fatia do próprio conteúdo acima da dobra. Medimos a
      // posição "intrínseca" (sem a compensação que já aplicamos antes) e,
      // se for negativa, empurramos o wrapper de volta com `marginTop` até
      // encostar em 0 — depois disso a altura disponível é calculada a
      // partir dessa posição já corrigida.
      // Posição no CONTEÚDO, não na tela: se a página chegar a rolar (tela
      // muito baixa, escala já no mínimo), rolar deixava o topo negativo — a compensação abaixo confundia isso
      // com a Navbar e empurrava a página de volta, impedindo de ver o fim.
      const rawTop = outer.getBoundingClientRect().top + scrollOffset(outer);
      const intrinsicTop = rawTop - topOffsetRef.current;
      const nextTopOffset = Math.max(0, -intrinsicTop);
      if (nextTopOffset !== topOffsetRef.current) {
        topOffsetRef.current = nextTopOffset;
        setTopOffset(nextTopOffset);
      }

      const top = Math.max(0, intrinsicTop);
      const availableHeight = window.innerHeight * (1 + scrollAllowance()) - top - bottomOffset;

      // Como no Power BI, a página preenche a tela: a sobra (ou a falta) de
      // altura é dividida entre as linhas de gráficos, ajustando a variável
      // --bi-chart-h que o CSS aplica em todo .bi-chart-box. As linhas são
      // contadas pelo topo dos cards. Só depois disso, se ainda não couber
      // (gráficos já no mínimo), entra a escala.
      const boxes = Array.from(inner.querySelectorAll<HTMLElement>(".bi-chart-box"));
      if (boxes.length && (fillPasses < MAX_FILL_PASSES || locked)) {
        const cards = new Set(boxes.map((box) => (box.closest(".chart-content-wrapper") as HTMLElement | null) ?? box));
        const rows = new Set(Array.from(cards).map((card) => Math.round(card.getBoundingClientRect().top / 8))).size;
        // Altura-base atual = a variável (a caixa pode estar maior que ela,
        // esticada pra preencher o card — medir a caixa fazia a conta oscilar).
        const currentH =
          parseFloat(inner.style.getPropertyValue("--bi-chart-h")) ||
          boxes[0].getBoundingClientRect().height / (scaleRef.current || 1);
        // Corrige só FILL_DAMPING da diferença por passo: em algumas páginas
        // (Balança Comercial) a altura dos cards não acompanha a variável de
        // forma linear e a correção cheia passava do ponto, ida e volta, sem
        // parar (150px ↔ 460px). Diferenças pequenas vão inteiras, senão a
        // convergência ficava lenta no fim.
        const diff = (availableHeight - contentHeight) / rows;
        const step = Math.abs(diff) > 24 ? diff * FILL_DAMPING : diff;
        const nextH = Math.min(maxChartHeight(), Math.max(MIN_CHART_H, currentH + step));
        // Travado (oscilação): só deixa a altura DIMINUIR — sempre termina e
        // prefere gráficos mais baixos a reduzir a página inteira (que deixava
        // tudo miúdo e "espremido").
        if (Math.abs(nextH - currentH) > 4 && (!locked || nextH < currentH)) {
          fillPasses += 1;
          noteChange();
          inner.style.setProperty("--bi-chart-h", `${Math.round(nextH)}px`);
          // Espera os gráficos redesenharem antes de medir de novo — os do
          // Recharts (ResponsiveContainer) só reagem ao novo tamanho depois
          // de alguns quadros; medindo cedo (2 rAF) a conta via o layout do
          // passo ANTERIOR e oscilava.
          window.clearTimeout(settleId);
          settleId = window.setTimeout(compute, FILL_SETTLE_MS);
          return;
        }
      }

      const fitScale = Math.min(1, availableHeight / contentHeight);
      let nextScale = fitScale > 0 ? Math.max(fitScale, MIN_SCALE) : 1;

      // Histerese: a altura do conteúdo depende da própria escala (escala
      // menor = largura virtual maior = títulos/legendas quebram menos). Sem
      // isso o cálculo oscila entre dois estados (ex.: 0,886 → 749px, 0,865 →
      // 731px) e pode parar no que estoura a tela. Diminuir é sempre aceito
      // quando não cabe; aumentar só vale se o ganho passar de 3%.
      const currentScale = scaleRef.current;
      if (nextScale > currentScale && nextScale - currentScale < 0.03 && contentHeight * currentScale <= availableHeight) {
        nextScale = currentScale;
      }

      if (locked) nextScale = Math.min(nextScale, scaleRef.current);
      if (Math.abs(nextScale - scaleRef.current) > 0.001) noteChange();
      scaleRef.current = nextScale;
      setScale(nextScale);
      setNaturalHeight(contentHeight);

      // Mudar a escala muda a LARGURA de layout deste wrapper (100/escala%,
      // pra compensar o encolhimento visual) — e como os gráficos medem sua
      // própria largura disponível (Recharts ResponsiveContainer) pra
      // decidir quebra de linha da legenda etc., a altura real do conteúdo
      // pode mudar como EFEITO da escala que acabamos de aplicar. O
      // ResizeObserver que observa esse mesmo elemento pode não disparar de
      // novo (navegadores suprimem notificações que o próprio observer
      // causou, pra evitar loop) — por isso conferimos manualmente depois
      // que o navegador pintar o novo layout, e recalculamos se a altura
      // realmente mudou.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const freshInner = innerRef.current;
          if (!freshInner) return;
          if (Math.abs(freshInner.scrollHeight - contentHeight) > 1) compute();
        });
      });
    };

    // Debounced: a Navbar acima anima com transition-all duration-700 ao
    // abrir/fechar o painel de filtros, deslocando o `top` deste wrapper
    // durante a transição. Recalcular em cada frame intermediário prende o
    // layout num estado transitório errado — por isso esperamos a animação
    // assentar antes de aplicar a nova escala.
    const scheduleCompute = () => {
      if (debounceId) window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        // Conteúdo mudou (dados chegaram, filtro trocou): novo ciclo de
        // preenchimento. Ajustes do próprio ciclo convergem em poucos passos
        // (só reajusta acima de 4px), então isso não vira loop.
        fillPasses = 0;
        compute();
      }, 750);
    };

    compute();

    // Observa o conteúdo (gráficos que carregam de forma assíncrona) —
    // reage a dados assíncronos mudando a altura dos cards.
    const ro = new ResizeObserver(scheduleCompute);
    if (innerRef.current) ro.observe(innerRef.current);

    // Rede de segurança: a Navbar (irmã anterior) muda de altura ao
    // abrir/fechar o painel de filtros sem que isso apareça como resize
    // deste wrapper nem da janela — só desloca sua posição (`top`). Um
    // polling leve detecta esse deslocamento. IMPORTANTE: precisa atualizar
    // `lastSeenTop` a cada tick (não só dentro de `compute`), senão, com o
    // poll mais rápido que o debounce, cada tick reagenda o timer antes que
    // ele complete e `compute` nunca chega a rodar (loop sem fim).
    let lastSeenTop: number | null = null;
    const poll = window.setInterval(() => {
      const outer = outerRef.current;
      if (!outer) return;
      const top = outer.getBoundingClientRect().top + scrollOffset(outer);
      if (lastSeenTop === null || Math.abs(top - lastSeenTop) > 1) {
        lastSeenTop = top;
        scheduleCompute();
      }
    }, 400);

    // Redimensionar a janela recomeça o preenchimento do zero.
    const onResize = () => {
      fillPasses = 0;
      locked = false;
      changeTimes = [];
      scheduleCompute();
    };
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.clearInterval(poll);
      if (debounceId) window.clearTimeout(debounceId);
      if (settleId) window.clearTimeout(settleId);
      window.removeEventListener("resize", onResize);
      if (unlockTimer) window.clearTimeout(unlockTimer);
    };
  }, [isCompact, bottomOffset]);

  if (isCompact) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={outerRef}
      style={{
        height: naturalHeight ? naturalHeight * scale : undefined,
        overflow: "hidden",
        marginTop: topOffset || undefined,
        // O container pai (a área de scroll do layout) é flex-col. Sem
        // isso, este wrapper — um item flex — pode ser encolhido pelo
        // algoritmo de flex-shrink quando `marginTop` + `height` juntos
        // excedem o espaço do pai, cortando por baixo mesmo com a escala
        // já calculada corretamente pra caber.
        flexShrink: 0,
      }}
    >
      <div
        ref={innerRef}
        className="bi-fit"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${scale ? 100 / scale : 100}%`,
          // Sem isso, a margem superior do conteúdo filho (ex.: mt-24 da
          // página) colapsa através deste wrapper e renderiza no tamanho
          // natural, SEM ser escalada — fica fora da conta de
          // `naturalHeight * scale` e estoura por baixo, já que overflow
          // hidden corta o excesso lá embaixo. `flow-root` cria um novo
          // bloco de formatação que impede esse colapso, sem os efeitos
          // colaterais de recortar conteúdo que um `overflow: hidden` teria.
          display: "flow-root",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FitToScreen;
