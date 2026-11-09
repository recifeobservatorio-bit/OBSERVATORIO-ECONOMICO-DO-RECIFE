"use client";

import { useState } from "react";

import TableGeneric from "@/components/@global/tables/TableGeneric";

// Colunas DATE do parquet chegam como algo aceito por `new Date(...)`, não uma string ISO pronta.
const formatDate = (value: any) => {
  if (!value) return "-";
  const date = new Date(value);
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`;
};

const RfcPainelTable = ({ data = [], color = "#f97316" }: any) => {
  const [ordenation, setOrdenation] = useState([
    { index: 0, name: "NOME DA OBRA ATENDIDA", ordenation: 0 },
    { index: 1, name: "DATA DA SOLICITAÇÃO", ordenation: 0 },
    { index: 2, name: "DATA DA AUTORIZAÇÃO", ordenation: 0 },
    { index: 3, name: "PRODUTOR(A)", ordenation: 0 },
    { index: 4, name: "PORTE DA PRODUÇÃO (AUTO-DECLARAÇÃO)", ordenation: 0 },
    { index: 5, name: "QTD. DE PESSOAS NA EQUIPE", ordenation: 0 },
    { index: 6, name: "LOCALIDADE DE ORIGEM", ordenation: 0 },
    { index: 7, name: "LOCAÇÃO AUTORIZADA", ordenation: 0 },
    { index: 8, name: "Dias Para Autorização", ordenation: 0 },
  ]);

  const order = ordenation.find((item) => item.ordenation !== 0);
  const dataSorted = order
    ? [...data].sort((a: any, b: any) => (order.ordenation === 1 ? (a[order.name] > b[order.name] ? 1 : -1) : a[order.name] < b[order.name] ? 1 : -1))
    : data;

  const headers = [
    "Nome da Obra",
    "Solicitação",
    "Autorização",
    "Produtor",
    "Porte",
    "Tamanho da Equipe",
    "Cidade dos Produtores",
    "Locação",
    "Dias para Autorização",
  ];

  const rows = dataSorted.map((item: any) => [
    item["NOME DA OBRA ATENDIDA"],
    formatDate(item["DATA DA SOLICITAÇÃO"]),
    formatDate(item["DATA DA AUTORIZAÇÃO"]),
    item["PRODUTOR(A)"],
    item["PORTE DA PRODUÇÃO (AUTO-DECLARAÇÃO)"],
    item["QTD. DE PESSOAS NA EQUIPE"],
    item["LOCALIDADE DE ORIGEM"],
    item["LOCAÇÃO AUTORIZADA"],
    item["Dias Para Autorização"],
  ]);

  return (
    <div className="w-full flex flex-col flex-1">
      <TableGeneric
        ordenations={ordenation}
        onOrdenationChange={setOrdenation}
        enablePagination
        rowsPerPage={20}
        searchIndexes={[0]}
        color={color}
        headers={headers}
        title="RFC Painel"
        maxHeight={600}
        rows={rows}
      />
    </div>
  );
};

export default RfcPainelTable;
