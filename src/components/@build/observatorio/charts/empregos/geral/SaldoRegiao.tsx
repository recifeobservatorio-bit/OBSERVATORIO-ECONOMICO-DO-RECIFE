"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processGroupsValues } from "@/functions/process_data/observatorio/empregos/caged/cagedGroupsValues";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const SaldoRegiao = ({
  data,
  title = "Saldo por Região",
  year,
}: any) => {
  
  const chartData = processGroupsValues(data['caged'], "Região")

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
        />
      </ChartGrabber>
    </div>
  );
};

export default SaldoRegiao;
