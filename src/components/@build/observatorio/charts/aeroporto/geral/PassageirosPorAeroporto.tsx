"use client";

import React from "react";

import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processPassageirosPorAeroporto } from "@/functions/process_data/observatorio/aeroporto/geral/charts/passageirosPorAeroporto";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosPorAeroporto = ({
  rawData = [],
  title = "Passageiros por Aeroporto",
}: ChartBuild<AnacGeralHeaders[]>) => {

  const chartData = processPassageirosPorAeroporto(rawData);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          xKey="aeroporto"
          bars={[{ dataKey: "total", name: "Passageiros" }]}
          colors={ColorPalette.default}
          widthMultiply={130}
          height={500}
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosPorAeroporto;
