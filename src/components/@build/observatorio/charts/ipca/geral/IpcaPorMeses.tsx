"use client";

import React from "react";

import { IpcaGeralHeaders } from "@/@types/observatorio/@fetch/ipca";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";


const IpcaPorMeses = ({
  porMes = [],
  colors = ColorPalette.default,
  title = "Variação Mensal do IPCA",
  nameKey = "mes",
}: ChartBuild<IpcaGeralHeaders[]> & { porMes?: any[] }) => {
  // Exclui Brasil — quem quiser comparar com o Brasil usa o gráfico dedicado
  // (IpcaBrasilPorMeses). Série histórica completa (todos os anos), por mês.
  const chartData = porMes.map((row: any) => {
    const { Brasil, ...capitais } = row;
    return capitais;
  });
  const xKey = nameKey;
  const categorias = Object.keys(chartData[0] || {}).filter((key) => key !== "mes" && key !== "ano");

  const selectedColors = categorias.map((_, index) => colors[index % colors.length]);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={selectedColors}
          xKey={xKey}
          lines={categorias.map((categoria) => ({
            dataKey: categoria,
            name: categoria,
            strokeWidth: 2,
          }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default IpcaPorMeses;
