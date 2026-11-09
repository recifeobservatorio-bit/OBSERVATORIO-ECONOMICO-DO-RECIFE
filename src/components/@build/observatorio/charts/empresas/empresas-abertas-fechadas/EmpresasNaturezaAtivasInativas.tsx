"use client";

import React from "react";

import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";
import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";

const EmpresasBairroAtivasInativas = ({
  data,
  colors = [ColorPalette.status.good, ColorPalette.status.bad],
  municipio,
  title = "Empresas por Natureza Jurídica",
}: any) => {

  const dataAtivas = data?.['ativas']
  const dataInativas = data?.['inativas']

  const uniqueArrays = Array.from(new Set([...Object.keys(dataAtivas?.['Natureza Jurídica'] || {}), ...Object.keys(dataInativas?.['Natureza Jurídica'] || {})]))

  const chartData = uniqueArrays.map((key: string) => {
    const ativaNum = dataAtivas['Natureza Jurídica'][key] || 0
    const inativaNum = dataInativas['Natureza Jurídica'][key] || 0

    return { label: key, ativa: ativaNum, inativa: inativaNum } 
  }).sort((a, b) => (b['ativa'] + b['inativa']) - (a['ativa'] + a['inativa']))

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
        data={chartData}
        title={title + ` - (${municipio})`}
        colors={colors}
        xKey="label"
        bars={[
          {
            dataKey: "ativa",
            name: "Ativas",
            stackId: "stack",
          },
          {
            dataKey: "inativa",
            name: "Inativas",
            stackId: "stack",
          },
        ]}
        tooltipEntry=""
        widthMultiply={140}
        height={480}
        maxBarSize={28}
      />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasBairroAtivasInativas;
