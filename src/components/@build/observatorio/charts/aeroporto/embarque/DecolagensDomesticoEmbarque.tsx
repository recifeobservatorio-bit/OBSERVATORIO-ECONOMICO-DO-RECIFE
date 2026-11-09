"use client";
import React from "react";

import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processEmbarqueDesembarqueNaturezaTipo } from "@/functions/process_data/observatorio/aeroporto/embarque/embarqueDesembarqueNaturezaTipo";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const DecolagensEmbarqueDom = ({
  data,
  toCompare = ["Recife"],
  title = "Doméstico Decolagens",
  colors = ColorPalette.default,
  monthRecent,
  subText = 'UF Destino',
  type
}: ChartBuild<AnacGeralHeaders[]>) => {

  const chartData = processEmbarqueDesembarqueNaturezaTipo(
    data,
    toCompare,
    "Doméstica",
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
          colors={colors}
          xKey="uf"
          bars={[{ dataKey: "total", name: "Decolagens" }]}
          height={400} // Altura do viewport visível para scroll
          barSize={30} // Altura individual de cada barra
        />
        {/* Renderiza o subText dentro do ChartGrabber */}
        {/* Legenda do eixo embaixo, centralizada (como em "País Destino") — girada na
            lateral ela ficava por cima dos números do eixo. */}
        <div className="w-full flex justify-center mt-0.5">
          {subText && (
            <p
              className="text-xs font-semibold leading-4"
              style={{ color: colors[6] }} // Aplica a cor dinamicamente
            >
              {subText}
            </p>
          )}
        </div>
      </ChartGrabber>
    </div>
  );
};

export default DecolagensEmbarqueDom;