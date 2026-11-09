"use client";

import React from "react";

import TreeMapChart from "@/components/@global/charts/TreeMapChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PerfilRaca = ({
  data,
  title = "Distribuição do estoque de economia criativa por raça",
  colors = ColorPalette.default,
}: any) => {
  const chartData = getObjToArr<number>(data["Raça Cor"] || {});

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <TreeMapChart data={chartData} title={title} colors={colors} xKey="label" dataKey="value" />
      </ChartGrabber>
    </div>
  );
};

export default PerfilRaca;
