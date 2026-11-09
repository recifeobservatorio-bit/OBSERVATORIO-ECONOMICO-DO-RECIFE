"use client";

import React from "react";

import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processEmbarqueDesembarqueNaturezaTipo } from "@/functions/process_data/observatorio/aeroporto/embarque/embarqueDesembarqueNaturezaTipo";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosEmbarqueDom = ({
  data,
  toCompare = ["Recife"],
  title = "Doméstico Passageiros",
  colors = ColorPalette.default,
  monthRecent,
  subText = 'UF Destino',
  type
}: ChartBuild<AnacGeralHeaders[]>) => {
  // Assumimos que o filtro de dados (ano, etc.) já foi aplicado antes de passar para o componente.
  const chartData = processEmbarqueDesembarqueNaturezaTipo(
    data,
    toCompare,
    "Doméstica",
    "passageiros",
    type ?? "Embarque",
    monthRecent
  );

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={`${type} ${title}`}
          colors={colors}
          xKey="uf"
          bars={[{ dataKey: "total", name: "Passageiros" }]}
          widthMultiply={130}
          height={500}
        />
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

export default PassageirosEmbarqueDom;
