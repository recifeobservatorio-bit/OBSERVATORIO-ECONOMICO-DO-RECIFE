"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { contarObrasPor } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ProducoesTipo = ({ data = [], title = "Tipo de Produções" }: any) => {
  const acc = contarObrasPor(data, ["TIPO DE OBRA"]);
  const chartData = getObjToArr<number>(acc["TIPO DE OBRA"] || {}).sort((a, b) => b.value - a.value);

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
          widthY={160}
          left={-15}
        />
      </ChartGrabber>
    </div>
  );
};

export default ProducoesTipo;
