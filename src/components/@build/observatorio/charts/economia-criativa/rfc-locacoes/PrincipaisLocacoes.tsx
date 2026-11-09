"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Cada linha já é uma locação — sem dedupe por ID aqui (diferente dos gráficos de RFC Produções).
const PrincipaisLocacoes = ({ data = [], title = "Principais Locações" }: any) => {
  const acc = geralAccFunction(data, ["LOCAÇÃO AUTORIZADA"]);
  const chartData = getObjToArr<number>(acc["LOCAÇÃO AUTORIZADA"] || {}).sort((a, b) => b.value - a.value).slice(0, 15);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Locações" }]}
          colors={ColorPalette.default}
          heightPerCategory={50}
          widthY={260}
          left={0}
        />
      </ChartGrabber>
    </div>
  );
};

export default PrincipaisLocacoes;
