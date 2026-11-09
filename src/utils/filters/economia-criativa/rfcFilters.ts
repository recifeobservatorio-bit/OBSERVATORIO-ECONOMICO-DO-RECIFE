// rfc.parquet não é particionado por ano — Ano/Mês são feitos via additionalFilters sobre os
// campos decorados (ver rfcDataService.ts), não pelo seletor especial de Ano do topo.
export const rfcFilters = {
  hideYearFilter: true,
  additionalFilters: [
    {
      label: "Ano",
      options: [],
      selected: [],
    },
    {
      label: "Mês",
      options: [],
      selected: [],
    },
    {
      label: "Tipo de Obra",
      options: [],
      selected: [],
    },
    {
      label: "Porte",
      options: [],
      selected: [],
    },
    {
      label: "Status de Aprovação",
      options: [],
      selected: [],
    },
    {
      label: "Produção",
      options: [],
      selected: [],
    },
  ],
};
