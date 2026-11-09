"use client";

import React from "react";

import { PortoPassageirosOutputData } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processPassageirosPorMesTodosAnos } from "@/functions/process_data/observatorio/porto/passageiro/charts/passageirosPorAnoPorto";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosVariacaoPortoAno = ({
  data,
  colors = ColorPalette.default,
  title = "Variação de Passageiros (vs. mesmo mês do ano anterior)",
}: ChartBuild<PortoPassageirosOutputData>) => {
  const updatedData = processPassageirosPorMesTodosAnos(data.passageiros.porAno ?? []);
  const xKey = "mes";

  return (
    <div className="chart-wrapper col-span-full">
      <ChartGrabber>
        <LineChart
          data={updatedData}
          title={title}
          colors={colors}
          xKey={xKey}
          lines={[
            { dataKey: "variation", name: "Variação (%)", strokeWidth: 2 },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosVariacaoPortoAno;
