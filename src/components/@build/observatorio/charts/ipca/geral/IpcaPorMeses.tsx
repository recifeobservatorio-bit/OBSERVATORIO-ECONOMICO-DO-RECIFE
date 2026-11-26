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
  title = "Variação Mensal do IPCA - Recife x Brasil",
  nameKey = "mes",
}: ChartBuild<IpcaGeralHeaders[]> & { porMes?: any[] }) => {
  // Capital(is) do filtro + Brasil no mesmo gráfico (pedido: juntar "Variação
  // mensal Brasil" e "Variação mensal IPCA Recife"). Série histórica completa, por mês.
  const chartData = porMes;
  const xKey = nameKey;
  const categorias = Object.keys(chartData[0] || {}).filter((key) => key !== "mes" && key !== "ano" && key !== "Brasil");
  const hasBrasil = chartData.some((row: any) => row?.Brasil != null);

  const selectedColors = [
    ...categorias.map((_, index) => colors[index % colors.length]),
    ...(hasBrasil ? [ColorPalette.status.neutral] : []),
  ];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={selectedColors}
          xKey={xKey}
          lines={[
            ...categorias.map((categoria) => ({ dataKey: categoria, name: categoria, strokeWidth: 2 })),
            // Brasil tracejado, como referência.
            ...(hasBrasil ? [{ dataKey: "Brasil", name: "Brasil", strokeWidth: 2, dashed: true }] : []),
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default IpcaPorMeses;
