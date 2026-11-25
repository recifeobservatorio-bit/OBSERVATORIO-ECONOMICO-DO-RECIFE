"use client";

import React from "react";

import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processTotalImportacaoExportacao } from "@/functions/process_data/observatorio/balanca-comercial/comercial/charts/totalImportacaoExportacao";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthLongName } from "@/utils/formatters/@global/monthLongName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Topo da página "Balança Analítico" do Power BI: rosca com o negociado no
// período (janeiro até o último mês dos dados) e pizza só do último mês.
const NegociadoPeriodoMes = ({ data = [], municipio, year }: any) => {
  const rows = (data as any[]).filter((r) => !municipio || r["Município"] === municipio);
  const months = rows.map((r) => monthOptionIndex(String(r["Mês"]))).filter((m) => m >= 1 && m <= 12);
  const first = months.length ? Math.min(...months) : 0;
  const last = months.length ? Math.max(...months) : 0;
  const lastRows = rows.filter((r) => monthOptionIndex(String(r["Mês"])) === last);
  const colors = [ColorPalette.status.bad, ColorPalette.status.good];
  const nome = municipio ?? "";
  const periodo = first && last ? `${monthLongName(first)} a ${monthLongName(last)}/${year}` : `${year}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
