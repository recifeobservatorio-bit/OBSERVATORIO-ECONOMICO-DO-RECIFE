"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasSecao = ({
  data,
  municipio,
  color,
  title = "Empresas por Seção",
  year,
}: any) => {
  const dataEmpresas = data
  // const dataEmpresas = data['empresas']

  const chartData = getObjToArr<number>(dataEmpresas?.['nome_secao'] || {}).sort((a, b) => b.value - a.value)

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        {/* Barras deitadas (uma seção por linha): ~20 colunas em pé num card
            de 1/4 da largura deixavam os valores um por cima do outro. */}
        <ScrollableBarChart
          data={chartData}
          title={title + ` - (${municipio})`}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={[color]}
          heightPerCategory={50}
          widthY={130}
          left={-15}
          maxBarSize={20}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasSecao;
