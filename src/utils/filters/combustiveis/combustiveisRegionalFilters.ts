export const combustiveisRegionalFilters = {
  years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  additionalFilters: [
    {
      label: "PRODUTO",
      options: ["Etanol Hidratado", "Gasolina Aditivada", "Gasolina Comum", "Glp", "Gnv", "Oleo Diesel", "Oleo Diesel S10"],
      selected: ["Gasolina Comum"],
      // Volta pra Gasolina Comum no "Limpar Filtros" (o serviço já usa ela quando
      // nada está marcado, então mostrar "Tudo" seria enganoso).
      keepOnReset: true,
    },
  ],
};
