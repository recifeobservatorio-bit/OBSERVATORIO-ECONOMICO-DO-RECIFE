"use client";

import React from "react";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMunicipioNatureza = ({
  data,
  title = "Empresas Ativas por Município",
  year,
}: any) => {
  const dataRawData = data['rawData']['municipio']

  const chartData = getObjToArr<number>(dataRawData['Municipio'] || {}).sort((a, b) => b.value - a.value)

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

export default EmpresasMunicipioNatureza;
