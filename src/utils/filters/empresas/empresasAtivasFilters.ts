import { monthHash } from "@/utils/hashs/monthHash";

export const empresasAtivasFilters = {
    years: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"], // Filtra pelo ano de abertura da empresa (derivado de data_abertura_empresa)
    additionalFilters: [
      {
        label: "Grupo",
        options: [],
        selected: [],
      },
      {
        label: "nome_bairro",
        displayLabel: "Bairro",
        options: [],
        selected: [],
      },
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