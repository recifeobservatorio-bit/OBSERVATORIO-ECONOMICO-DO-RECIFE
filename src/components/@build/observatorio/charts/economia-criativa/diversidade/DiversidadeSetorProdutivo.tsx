"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const DiversidadeSetorProdutivo = ({
  data,
  title = "Distribuição de profissionais com necessidades especiais por setor produtivo",
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
          colors={ColorPalette.default}
        />
      </ChartGrabber>
    </div>
  );
};

export default DiversidadeSetorProdutivo;
