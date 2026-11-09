"use client";

import React from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const DesligamentosAno = ({
  data = [],
  colors = [ColorPalette.status.badLine],
  title = "Desligamentos no ano",
}: any) => {

  const chartData = getObjToArr<number>(data["Mês Desligamento"] || {}).sort((a, b) => +a.label - +b.label).map((item) => ({ ...item, label: monthShortName(+item.label) }))

  const media = chartData.length ? chartData.reduce((acc, item) => acc + item.value, 0) / chartData.length : 0;

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={colors}
          xKey="label"
          lines={[
            { dataKey: "value", name: "Desligamentos", strokeWidth: 2 },
          ]}
          referenceLine={{ value: media, label: `Linha média: ${media.toFixed(0)}` }}
        />
      </ChartGrabber>
    </div>
  );
};

export default DesligamentosAno;
