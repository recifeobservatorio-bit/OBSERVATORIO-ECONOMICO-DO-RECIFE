"use client";

import React from "react";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { formatBairroLabel } from "@/utils/formatters/@global/formatBairroLabel";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasBairroAtivasInativas = ({
  data,
  colors = [ColorPalette.status.good, ColorPalette.status.bad],
  title = "Empresas por Bairro",
  year,
}: any) => {
  const uniqueArrays = Array.from(new Set([...Object.keys(data['ativas']['nome_bairro']), ...Object.keys(data['inativas']['nome_bairro'])]))

  const chartData = uniqueArrays.map((key: string) => {
    const ativaNum = data['ativas']['nome_bairro'][key] || 0
    const inativaNum = data['inativas']['nome_bairro'][key] || 0

    return { label: formatBairroLabel(key), ativa: ativaNum, inativa: inativaNum }
  }).sort((a, b) => (b['ativa'] + b['inativa']) - (a['ativa'] + a['inativa']))

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
        data={chartData}
        title={title}
        colors={colors}
        xKey="label"
        bars={[
          {
            dataKey: "ativa",
            name: "Ativas",
            stackId: "empresas",
          },
          {
            dataKey: "inativa",
            name: "Inativas",
            stackId: "empresas",
          },
        ]}
        widthMultiply={110}
        heightToPass={362}
        maxBarSize={28}
      />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasBairroAtivasInativas;
