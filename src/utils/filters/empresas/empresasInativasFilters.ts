import { monthHash } from "@/utils/hashs/monthHash";

export const empresasInativasFilters = {
    years: ["2021", "2022", "2023", "2024", "2025", "2026"], // Filtra pelo ano de abertura da empresa (derivado de data_abertura_empresa)
    additionalFilters: [
      {
        label: "Grupo",
        options: [],
        selected: [],
      },
      {
        label: "mes",
        options: [],
        selected: [],
        hash: monthHash
      },
    //   {
    //     label: "Mês",
    //     options: [],
    //     selected: [],
    //   },
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