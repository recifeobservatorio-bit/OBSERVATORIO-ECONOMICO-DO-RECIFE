"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { uniqueLabel } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { raisNaturezaJuridicaDicts } from "@/utils/dicts/rais/raisNaturezaJuridicaDicts";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const NaturezaJuridica = ({
  data,
  title = "Distribuição do estoque formal de empregos por natureza jurídica",
}: any) => {
  const chartData = uniqueLabel(
    getObjToArr<number>(data["Natureza Jurídica"] || {}).map((item) => ({
      ...item,
      label: raisNaturezaJuridicaDicts[item.label] || item.label,
    }))
  ).sort((a, b) => b.value - a.value);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          heightPerCategory={50}
          widthY={200}
          left={0}
        />
      </ChartGrabber>
    </div>
  );
};

export default NaturezaJuridica;
