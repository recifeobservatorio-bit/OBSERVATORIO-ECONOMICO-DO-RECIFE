"use client";

import React from "react";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { uniqueLabel } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { raisDivisaoSecaoDicts } from "@/utils/dicts/rais/raisDivisaoSecaoDicts";
import { raisGrupoDicts } from "@/utils/dicts/rais/raisGrupoDicts";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const GruposDistribuicaoSecao = ({
  data,
  title = "Estoque formal de empregos por Descrição Seção",
  year,
}: any) => {
  
  const chartData = uniqueLabel(getObjToArr<number>(data['divisao'] || {}).map((item) => ({...item, label: raisDivisaoSecaoDicts[item.label] }))).sort((a, b) => b.value - a.value)

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
          widthMultiply={130}
          xAxisFontSize={9}
        />
      </ChartGrabber>
    </div>
  );
};

export default GruposDistribuicaoSecao;
