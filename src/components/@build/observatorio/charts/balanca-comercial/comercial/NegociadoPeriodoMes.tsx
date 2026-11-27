"use client";

import React from "react";

import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processTotalImportacaoExportacao } from "@/functions/process_data/observatorio/balanca-comercial/comercial/charts/totalImportacaoExportacao";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthLongName } from "@/utils/formatters/@global/monthLongName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const usd = (v: number) => `$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const soma = (rows: any[]) => rows.reduce((acc, r) => acc + (Number(r["Valor US$"]) || 0), 0);

// Topo da página "Balança Analítico" do Power BI: card "Total Negociado" (período
// atual x mesmo período do ano anterior), rosca com o negociado no período
// (janeiro até o último mês dos dados) e pizza só do último mês.
const NegociadoPeriodoMes = ({ data = [], dataPast = [], municipio, year }: any) => {
  const rows = (data as any[]).filter((r) => !municipio || r["Município"] === municipio);
  const months = rows.map((r) => monthOptionIndex(String(r["Mês"]))).filter((m) => m >= 1 && m <= 12);
  const first = months.length ? Math.min(...months) : 0;
  const last = months.length ? Math.max(...months) : 0;
  const lastRows = rows.filter((r) => monthOptionIndex(String(r["Mês"])) === last);
  const colors = [ColorPalette.status.bad, ColorPalette.status.good];
  const nome = municipio ?? "";
  const periodo = first && last ? `${monthLongName(first)} a ${monthLongName(last)}/${year}` : `${year}`;

  // Card "Total Negociado": soma do período e do mesmo período (mesmos meses) do ano anterior.
  const total = soma(rows);
  const rowsPast = (dataPast as any[]).filter((r) => {
    const m = monthOptionIndex(String(r["Mês"]));
    return (!municipio || r["Município"] === municipio) && m >= first && m <= last;
  });
  const totalPast = soma(rowsPast);
  const variacao = totalPast ? ((total - totalPast) / totalPast) * 100 : null;
  const anoPast = Number(year) - 1;
  const periodoPast = first && last ? `${monthLongName(first)}/${anoPast} a ${monthLongName(last)}/${anoPast}` : String(anoPast);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-4 w-full">
      <div className="bi-kpi chart-content-wrapper relative flex flex-col">
        <h3 className="bi-chart-title text-center font-semibold">
          {`Total Negociado - ${nome} - Período: ${periodo}`}
        </h3>
        <div className="flex-1 flex flex-col justify-center gap-3 px-5 py-4 border-l-4 border-[#E66C37] m-3">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">{usd(total)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Período: {periodoPast} <span className="font-semibold text-gray-800 dark:text-gray-100">{usd(totalPast)}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Variação acumulada{" "}
            {variacao == null ? (
              "--"
            ) : (
              <span className={`font-semibold ${variacao >= 0 ? "text-green-600" : "text-red-600"}`}>
                {variacao >= 0 ? "▲" : "▼"} {Math.abs(variacao).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="chart-content-wrapper relative">
        <div className="chart-wrapper">
          <ChartGrabber>
            <PieChart
              donut
              data={processTotalImportacaoExportacao(rows)}
              title={`Negociado - ${nome} de ${periodo}`}
              dataKey="total"
              nameKey="tipo"
              colors={colors}
              showPercentages
              tooltipEntry=" dólares"
            />
          </ChartGrabber>
        </div>
      </div>
      <div className="chart-content-wrapper relative">
        <div className="chart-wrapper">
          <ChartGrabber>
            <PieChart
              data={processTotalImportacaoExportacao(lastRows)}
              title={`Balança Comercial - ${nome} em ${last ? monthLongName(last) : ""}/${year}`}
              dataKey="total"
              nameKey="tipo"
              colors={colors}
              showPercentages
              tooltipEntry=" dólares"
            />
          </ChartGrabber>
        </div>
      </div>
    </div>
  );
};

export default NegociadoPeriodoMes;
