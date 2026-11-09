"use client";

import React from "react";

import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";
import BarChart from "@/components/@global/charts/BarChart";

const EmpresasPorteAtivasInativas = ({
  data,
  colors = [ColorPalette.status.good, ColorPalette.status.bad],
  municipio,
  title = "Empresas por Porte",
  year,
}: any) => {

  const dataAtivas = data?.['ativas']
  const dataInativas = data?.['inativas']

  const uniqueArrays = Array.from(new Set([...Object.keys(dataAtivas?.['Porte'] || {}), ...Object.keys(dataInativas?.['Porte'] || {})]))

  const chartData = uniqueArrays.map((key: string) => {
    const ativaNum = dataAtivas['Porte'][key] || 0
    const inativaNum = dataInativas['Porte'][key] || 0

    return { label: key, ativa: ativaNum, inativa: inativaNum } 
  }).sort((a, b) => (b['ativa'] + b['inativa']) - (a['ativa'] + a['inativa']))

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
        data={chartData}
        title={title + ` - (${municipio})`}
        colors={colors}
        xKey="label"
        bars={[
          {
            dataKey: "ativa",
            name: "Ativas",
          },
          {
            dataKey: "inativa",
            name: "Inativas",
          },
        ]}
        tooltipEntry=""
        height={480}
        maxBarSize={40}
      />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasPorteAtivasInativas;
