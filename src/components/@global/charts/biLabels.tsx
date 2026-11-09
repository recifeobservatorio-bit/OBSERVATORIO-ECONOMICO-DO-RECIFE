// Rótulos de valor no estilo Power BI: o número escrito na ponta da barra ou
// em pontos-chave da linha, no lugar do eixo de valores e da grade.

const nf = (digits: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: digits });

/** Valor compacto: 1,2 bi / 24,5 mi / 47,2 mil / 956 / 0,46.
 *  Espaço entre número e unidade é não-separável ( ): o Recharts quebra o
 *  rótulo em linhas na largura da barra e "147,3 mi" virava "147,3" / "mi". */
export function formatDataLabel(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${nf(1).format(n / 1e9)} bi`;
  if (abs >= 1e6) return `${nf(1).format(n / 1e6)} mi`;
  if (abs >= 1e4) return `${nf(1).format(n / 1e3)} mil`;
  if (abs >= 100) return nf(0).format(n);
  if (abs >= 10) return nf(1).format(n);
  return nf(2).format(n);
}

export const DATA_LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 600,
  fill: "var(--bi-label-color, #1f2937)",
} as const;

/**
 * Índices dos pontos-chave de uma série (primeiro, último, máximo e mínimo) —
 * os únicos que recebem rótulo nos gráficos de linha, como no Power BI, pra
 * não amontoar números em séries longas.
 */
export function keyPointIndexes(values: unknown[], compact = false): Set<number> {
  // null/undefined = sem dado: Number(null) seria 0 e viraria o "mínimo" da série.
  const nums = values.map((v) => (v == null ? NaN : Number(v)));
  const valid = nums.map((n, i) => [n, i] as const).filter(([n]) => Number.isFinite(n));
  const out = new Set<number>();
  if (!valid.length) return out;
  out.add(valid[valid.length - 1][1]);
  let max = valid[0];
  let min = valid[0];
  for (const p of valid) {
    if (p[0] > max[0]) max = p;
    if (p[0] < min[0]) min = p;
  }
  out.add(max[1]);
  // Gráfico estreito: só máximo e último — os 4 rótulos se amontoavam.
  if (compact) return out;
  out.add(valid[0][1]);
  out.add(min[1]);
  return out;
}
