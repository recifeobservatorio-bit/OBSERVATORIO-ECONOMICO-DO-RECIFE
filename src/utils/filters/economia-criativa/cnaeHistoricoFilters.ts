// "Ano" pré-selecionado em 2025 (o mais recente) pra bater com o KPI "Total de Empresas: 7.571"
// por padrão — sem seleção, applyGenericFilters mostraria os 3 anos somados. "Categoria" é
// decorado como alias de "Classe" (mesma coluna usada no gráfico "por Classe", reaproveitada
// como filtro). "Subclasse" é alias de "CNAE 2.0 Subclasse - Codigo".
export const cnaeHistoricoFilters = {
  hideYearFilter: true,
  additionalFilters: [
    {
      label: "Ano",
      options: [],
      selected: ["2025"],
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
