"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasPorAtividade = ({
  data = [],
  title = "Total de Empresas por Atividade",
}: any) => {
  const acc = geralAccFunction(data, ["Descrição"]);
  const chartData = getObjToArr<number>(acc["Descrição"] || {}).sort((a, b) => b.value - a.value).slice(0, 25);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          heightPerCategory={40}
          widthY={260}
          left={0}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasPorAtividade;
