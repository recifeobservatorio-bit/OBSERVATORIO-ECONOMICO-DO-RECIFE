export const empresasTempoAberturaFilters = {
    years: ["2021", "2022", "2023", "2024", "2025"], // Filtra por ano — empresas_tempo_medio.parquet só tem dados até 2025
    additionalFilters: [
      // empresas_tempo_medio.parquet não tem coluna numérica 'mes' como os outros arquivos —
      // só 'Mes Deferimento', com o nome do mês por extenso.
      {
        label: "Mes Deferimento",
        options: [],
        selected: [],
      },
    ],
  };
