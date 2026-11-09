"use client";

import React from "react";

import { PortoPassageirosOutputData } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processPassageirosPorMesTodosAnos } from "@/functions/process_data/observatorio/porto/passageiro/charts/passageirosPorAnoPorto";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosPortoAno = ({
  data,
  colors = ColorPalette.default,
  title = "Passageiros ao Longo do Tempo",
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
          lines={[{ dataKey: "passageiros", name: "Passageiros", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosPortoAno;
