import { monthHash } from "@/utils/hashs/monthHash";

export const empresasClassesFilters = {
    years: ["2025", "2026"], // Filtra por ano — empresas_classes.parquet só tem dados de 2025/2026
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
      // {
      //   label: "Mês",  
      //   options: [],  
      //   selected: [],
      // },
    //   {
    //     label: "município",  
    //     options: [],  
    //     selected: ["Recife-PE"],
    //   },
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