"use client";

import React from "react";

import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processEmbarqueDesembarqueNaturezaTipo } from "@/functions/process_data/observatorio/aeroporto/embarque/embarqueDesembarqueNaturezaTipo";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const DecolagensIntEmbarque = ({
  data,
  toCompare = ["Recife"],
  title = "Internacional Decolagens",
  colors = ColorPalette.default,
  monthRecent,
  subText = 'País Destino',
  type
}: ChartBuild<AnacGeralHeaders[]>) => {

  const chartData = processEmbarqueDesembarqueNaturezaTipo(
    data,
    toCompare,
    'Internacional',
    "decolagens",
    type ?? "Embarque",
    monthRecent
  );

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <VerticalScrollableBarChart
          data={chartData}
          title={`${type} ${title}`}
          colors={[colors[1]]}
          xKey="uf"
          bars={[{ dataKey: "total", name: "Decolagens" }]}
        />
        <div className="w-full flex justify-center mt-0.5">
          {subText && (
            <p
              className="text-xs font-semibold leading-4"
              style={{ color: colors[1] }} // Aplica a cor dinamicamente
            >
              {subText}
            </p>
          )}
        </div>
      </ChartGrabber>
    </div>
  );
};

export default DecolagensIntEmbarque;
