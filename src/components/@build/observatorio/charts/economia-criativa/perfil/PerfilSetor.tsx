"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PerfilSetor = ({
  data,
  title = "Distribuição do estoque de economia criativa por setor produtivo",
  colors = ColorPalette.default,
}: any) => {
  const chartData = getObjToArr<number>(data["setor"] || {}).sort((a, b) => b.value - a.value);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={colors}
        />
      </ChartGrabber>
    </div>
  );
};

export default PerfilSetor;
