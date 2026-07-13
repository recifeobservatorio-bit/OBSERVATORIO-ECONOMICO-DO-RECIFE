// The flat-parquet fetch pattern (Capag/Combustiveis/Tributos and the newly
// migrated legacy modules) downloads every year in one file, replacing the
// old per-year REST endpoints. applyGenericFilters never filtered by year
// (see its implementation), so each service must apply this explicitly.
export function filterByYear<T extends Record<string, any>>(rows: T[], year: string, field: string): T[] {
  return rows.filter((r) => String(r[field]) === String(year));
}
