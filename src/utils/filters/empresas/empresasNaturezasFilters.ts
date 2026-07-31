import { monthHash } from "@/utils/hashs/monthHash";

export const empresasNaturezasFilters = {
    years: ["2025", "2026"], // Filtra por ano — empresas_naturezas.parquet só tem dados de 2025/2026
    additionalFilters: [
      {
        label: "mes",  
        options: [],  
        selected: [],
        hash: monthHash        
      },
      {
        label: "Municipio",  
        options: [],  
        selected: ["Recife"],
      },
    //   {
    //     label: "mês",  
    //     options: [],  
    //     selected: [],
    //   },
    //   {
    //     label: "saldomovimentação",  
    //     options: [],  
    //     selected: [],
    //   },
    //   {
    //     label: "grupamento",
    //     options: ['Indústria', 'Comércio', 'Agropecuária', 'Serviços', 'Construção'],  
    //     selected: [],
    //     blocked: true,  
    //   },
    ],
  };