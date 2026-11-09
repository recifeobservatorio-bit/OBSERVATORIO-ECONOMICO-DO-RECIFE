"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const SaldoAno = ({
  data,
  nameKey = "Mês",
  colors = ColorPalette.default,
  title = "Saldo ao Longo do Ano",
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
          lines={[{ dataKey: "Saldos", name: "Saldo", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default SaldoAno;
