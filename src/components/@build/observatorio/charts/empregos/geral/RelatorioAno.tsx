"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const RelatorioAno = ({
  data,
  nameKey = "Mês",
  colors = [ColorPalette.status.good, ColorPalette.status.badLine],
  title = "Demissões/Admissões ao Longo do Ano",
}: any) => {
  const chartData = data['municipiosPorMes'] ?? [];
  const xKey = nameKey;

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={colors}
          xKey={xKey}
          lines={[{ dataKey: "Admissões", name: "Admissões", strokeWidth: 2 }, { dataKey: "Demissões", name: "Demissões", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default RelatorioAno;
