"use client";

import { useState } from "react";

import TableGeneric from "@/components/@global/tables/TableGeneric";
import { formatNormalnumber } from "@/utils/formatters/@global/numberFormatter";
import { monthLongName } from "@/utils/formatters/@global/monthLongName";

// Tabela por período (mês do ano filtrado), como no Power BI das abas
// Empresas Ativas / Inativas / Ativas x Inativas.
//  - modo simples (data.mes): Mês | Quantidade | Variação vs mês anterior | Mesmo mês do ano anterior
//  - modo comparativo (data.ativas / data.inativas): Mês | Ativas | Inativas | % Ativas

type Row = Record<string, number>;

const pct = (value: number) => `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

const buildSimple = (mes: Record<string, number> = {}, mesPast: Record<string, number> = {}): Row[] => {
  const months = Object.keys(mes).map(Number).filter((m) => m >= 1 && m <= 12).sort((a, b) => a - b);
  return months.map((m, i) => {
    const qtd = Number(mes[m]) || 0;
    const prev = i > 0 ? Number(mes[months[i - 1]]) || 0 : 0;
    const past = Number(mesPast?.[m]) || 0;
    return {
      mes: m,
      quantidade: qtd,
      variacao: prev ? ((qtd - prev) / prev) * 100 : 0,
      anoAnterior: past,
    };
  });
};

const buildCompare = (ativas: Record<string, number> = {}, inativas: Record<string, number> = {}): Row[] => {
  const months = Array.from(new Set([...Object.keys(ativas), ...Object.keys(inativas)]))
    .map(Number)
    .filter((m) => m >= 1 && m <= 12)
    .sort((a, b) => a - b);
  return months.map((m) => {
    const a = Number(ativas[m]) || 0;
    const ina = Number(inativas[m]) || 0;
    return { mes: m, ativas: a, inativas: ina, percentual: a + ina ? (a / (a + ina)) * 100 : 0 };
  });
};

const EmpresasPeriodoTabela = ({ data, title, label = "Empresas" }: any) => {
  const compare = !!data?.ativas && !!data?.inativas;
  const keys = compare ? ["mes", "ativas", "inativas", "percentual"] : ["mes", "quantidade", "variacao", "anoAnterior"];
  const [ordenation, setOrdenation] = useState(keys.map((name, index) => ({ index, name, ordenation: 0 })));
  const order = ordenation.find((item) => item.ordenation != 0);

  const rows = compare ? buildCompare(data.ativas.mes, data.inativas.mes) : buildSimple(data?.mes, data?.mesPast);
  const sorted = order
    ? [...rows].sort((a, b) => (order.ordenation === 1 ? a[order.name] - b[order.name] : b[order.name] - a[order.name]))
    : rows;

  const headers = compare
    ? ["Mês", "Ativas", "Inativas", "% Ativas"]
    : ["Mês", label, "Variação (mês anterior)", "Mesmo mês do ano anterior"];

  const cells = sorted.map((r) =>
    compare
      ? [monthLongName(r.mes), formatNormalnumber(r.ativas), formatNormalnumber(r.inativas), pct(r.percentual)]
      : [monthLongName(r.mes), formatNormalnumber(r.quantidade), pct(r.variacao), r.anoAnterior ? formatNormalnumber(r.anoAnterior) : "—"]
  );

  return (
    <div className="chart-wrapper w-full flex flex-col flex-1">
      <h3 className="bi-chart-title text-center font-semibold w-[90%] mx-auto text-gray-800 dark:text-gray-100">{title}</h3>
      {rows.length === 0 ? (
        <div className="p-4 text-center text-sm">Nenhum dado encontrado</div>
      ) : (
        <TableGeneric
          ordenations={ordenation}
          onOrdenationChange={setOrdenation}
          withClick
          maxHeight={320}
          rowsPerPage={100}
          color={"#ffffff"}
          headers={headers}
          title={""}
          rows={cells as string[][]}
        />
      )}
    </div>
  );
};

export default EmpresasPeriodoTabela;
