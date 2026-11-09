export function computeAvailableYears<T>(
  rows: T[],
  yearOf: (row: T) => string | number | null | undefined
): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    const y = yearOf(row);
    if (y !== null && y !== undefined && y !== "" && !Number.isNaN(Number(y))) {
      set.add(String(y));
    }
  }
  return [...set].sort((a, b) => Number(a) - Number(b));
}
