// "Setor Produtivo", "Categoria" e "Subclasse" são campos derivados adicionados pelo
// economiaCriativaDataService (decorateRows) — não existem como coluna crua no parquet, mas o
// relatório de referência tem esses 4 filtros (+ Sexo) em toda página baseada em RAIS.
export const economiaCriativaGeralFilters = {
  years: ["2021", "2022", "2023", "2024", "2025"],
  additionalFilters: [
    {
      label: "Sexo Trabalhador",
      options: [],
      selected: [],
    },
    {
      label: "Setor Produtivo",
      options: [],
      selected: [],
    },
    {
      label: "Categoria",
      options: [],
      selected: [],
    },
    {
      label: "Subclasse",
      options: [],
      selected: [],
    },
  ],
};
