"use client";

import React from "react";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { formatBairroLabel } from "@/utils/formatters/@global/formatBairroLabel";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasBairro = ({
  data,
  title = "Empresas por Bairro",
  year,
}: any) => {

  const chartData = getObjToArr<number>(data['nome_bairro'] || {})
    .map((item) => ({ ...item, label: formatBairroLabel(item.label) }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          widthMultiply={110}
          heightToPass={362}
          maxBarSize={28}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasBairro;
