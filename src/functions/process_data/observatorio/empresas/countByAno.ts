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
