export const microCagedGeralFilters = {
    years: ["2023", "2024", "2025", "2026"], // Filtra por ano
    additionalFilters: [
      {
        label: "município",  
        options: [],  
        selected: ["Recife-PE"],
      },
      {
        label: "mês",  
        options: [],  
        selected: [],
      },
      {
        label: "saldomovimentação",  
        options: [],  
        selected: [],
      },
      {
        label: "grupamento",
        options: ['Indústria', 'Comércio', 'Agropecuária', 'Serviços', 'Construção'],  
        selected: [],
        blocked: true,  
      },
    ],
  };