"use client";

import React from "react";

import ScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";
import { empresasCapitalsDicts } from "@/utils/dicts/empresas/empresasCapitalsDicts";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";

const EmpresasMediaAbertura = ({
  data,
  color,
//   municipio,
  title = "Tempo Médio Abertura de Empresas (Horas) ",
  year,
}: any) => {
  const dataEmpresas = data['empresas'] || {}

  const dataKeys = Object.keys(dataEmpresas)
  
  const dataFlat = dataKeys.map((dataMap) => dataEmpresas[dataMap]).flat()
  
  const dataMonthCur = Array.from(new Set(dataFlat.map((data) => monthOptionIndex(data['Mes Deferimento'])))).sort((a: number, b: number) => b - a)[0]

  const dataFiltred = dataFlat.filter((data: any) => monthOptionIndex(data['Mes Deferimento']) === dataMonthCur && empresasCapitalsDicts[data['Municipio']])

  const chartData = dataFiltred.map((data) => ({ label: data['Municipio'].split(' - ')[0], value: data['Tempo Médio de Abertura'] })).sort((a, b) => b['value'] - a['value'])

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <ScrollableBarChart
          data={chartData}
          title={title}
        //   title={title + ` - (${municipio})`}
          xKey="label"
          bars={[{ dataKey: "value", name: "Tempo" }]}
          colors={[color]}
          heightPerCategory={50}
          widthY={130}
          left={-15}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasMediaAbertura;
