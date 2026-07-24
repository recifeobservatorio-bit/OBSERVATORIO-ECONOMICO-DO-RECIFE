import { monthHash } from "@/utils/hashs/monthHash";

export const empregosCagedFilters = {
    years: ["2023", "2024", "2025", "2026"],
    additionalFilters: [
      {
        label: "Mes",
        options: [],
        selected: [],
        hash: monthHash
      },
      {
        label: "Municipio",  
        options: [],  
        selected: ['Recife-PE'],
      },
      {
        label: "Região",  
        options: [],  
        selected: [],
      },
      {
        label: "UF",  
        options: [],  
        selected: [],
      },
    ],
  };
  