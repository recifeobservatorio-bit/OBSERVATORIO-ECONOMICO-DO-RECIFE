"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { contarObrasPor } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ProducoesCidade = ({ data = [], title = "Cidade dos Produtores" }: any) => {
  const acc = contarObrasPor(data, ["LOCALIDADE DE ORIGEM"]);
  const chartData = getObjToArr<number>(acc["LOCALIDADE DE ORIGEM"] || {}).sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Produções" }]}
          colors={ColorPalette.default}
        />
      </ChartGrabber>
    </div>
  );
};

export default ProducoesCidade;
