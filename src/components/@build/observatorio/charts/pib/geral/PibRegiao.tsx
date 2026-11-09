"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processPibGroup } from "@/functions/process_data/observatorio/pib/geral/pibGroup";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PibRegiao = ({
  data,
  title = "PIB por Região",
}: any) => {
    
  const chartData =  processPibGroup(data.rawDataCurrent, 'regiao')

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="group"
          bars={[{ dataKey: "pib", name: "PIB Região" }]}
          colors={[ColorPalette.default[1]]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PibRegiao;
