import { monthHash } from "@/utils/hashs/monthHash";

export const portoGeralFilters = {
    years: ["2023", "2024", "2025", "2026"], // Filtra por ano
    additionalFilters: [
      {
        label: "Mes", // O Mês será preenchido dinamicamente
        options: [], // Deixe vazio para preencher com base nos dados
        selected: [],
        hash: monthHash
      },
      {
        label: "Município", // O Mês será preenchido dinamicamente
        options: [], // Deixe vazio para preencher com base nos dados
        selected: []
      },
      {
        label: "SGUF", // O Mês será preenchido dinamicamente
        options: [], // Deixe vazio para preencher com base nos dados
        selected: []
      },
      {
        label: "Porto Atracação",
        options: [], // Deixe vazio para preencher com base nos dados — agora inclui portos do Brasil inteiro
        selected: ['Recife', 'Suape'], // pré-seleção padrão: só os portos de Pernambuco
        allowMultiple: true
      },
      // { 
      //   label: "CDTUP",
      //   options: [], // Deixe vazio para preencher com base nos dados
      //   selected: ['Brrec'],
      //   allowMultiple: false
      // },
      { 
        label: "Ação", // O Mês será preenchido dinamicamente
        options: [], // Deixe vazio para preencher com base nos dados
        selected: []
      },
    ],
  };
  