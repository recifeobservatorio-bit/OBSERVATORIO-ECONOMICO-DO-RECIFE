import { monthHash } from "@/utils/hashs/monthHash";

export const empresasComparativoClasses = {
    years: ["2025", "2026"], // Filtra por ano — empresas_classes.parquet só tem dados de 2025/2026
    additionalFilters: [
      {
        label: "mes",
        options: [],
        // Sempre um mês selecionado (fixo em Maio/2026 por padrão) — sem isso o gráfico fica
        // filtrado só por ano, somando todos os meses, o que não é o comportamento esperado
        // nesta aba (precisa sempre de ano + mês juntos).
        selected: ["5"],
        allowMultiple: false,
        hash: monthHash
      },
    //   {
    //     label: "Municipio",  
    //     options: [],  
    //     selected: ["Recife"],
    //   },      
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