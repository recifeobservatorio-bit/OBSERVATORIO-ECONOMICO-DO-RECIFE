"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { dedupeProducoes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const Produtores = ({ data = [], title = "Produtores" }: any) => {
  const acc = geralAccFunction(dedupeProducoes(data), ["PRODUTOR(A)"]);
  const chartData = getObjToArr<number>(acc["PRODUTOR(A)"] || {}).sort((a, b) => b.value - a.value).slice(0, 15);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Produções" }]}
          colors={ColorPalette.default}
          heightPerCategory={50}
          widthY={260}
          left={0}
        />
      </ChartGrabber>
    </div>
  );
};

export default Produtores;
