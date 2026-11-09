"use client";

import React from "react";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasSecao = ({
  data,
  title = "Total de Empresas Ativas por Seção",
  year,
}: any) => {
  const dataEmpresas = data['empresas']

  const chartData = getObjToArr<number>(dataEmpresas['nome_secao'] || {}).sort((a, b) => b.value - a.value)

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          widthMultiply={140}
          height={440}
          maxBarSize={28}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasSecao;
