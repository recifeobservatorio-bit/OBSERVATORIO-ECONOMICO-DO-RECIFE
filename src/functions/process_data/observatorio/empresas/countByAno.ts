import { monthShortName } from "@/utils/formatters/@global/monthShortName";

export const countByAno = (rows: any[]): { ano: string; value: number }[] => {
  const counts = new Map<number, number>();

  for (const row of rows) {
    const ano = row["Ano"];
    if (ano == null) continue;
    counts.set(ano, (counts.get(ano) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([ano, value]) => ({ ano: String(ano), value }));
};

// Igual a countByAno, mas agrupando por (Ano, mês) — série histórica completa, um ponto
// pra cada mês de cada ano disponível.
export const countByAnoMes = (rows: any[], monthField = "mes"): { label: string; value: number }[] => {
  const counts = new Map<string, { ano: number; mes: number; value: number }>();

  for (const row of rows) {
    const ano = row["Ano"];
    const mes = Number(row[monthField]);
    if (ano == null || !mes || mes < 1 || mes > 12) continue;
    const key = `${ano}-${mes}`;
    const acc = counts.get(key) || { ano, mes, value: 0 };
    acc.value += 1;
    counts.set(key, acc);
  }

  return Array.from(counts.values())
    .sort((a, b) => a.ano * 100 + a.mes - (b.ano * 100 + b.mes))
    .map(({ ano, mes, value }) => ({
      label: `${monthShortName(mes)}/${ano}`,
      value,
    }));
};
