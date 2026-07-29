"use client";

import React, { useState } from "react";

import { PortoPassageirosOutputData } from "@/@types/observatorio/@data/portoData";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { processPassageirosAnoPorto } from "@/functions/process_data/observatorio/porto/passageiro/charts/passageirosAnoPorto";
import { processPassageirosPorAnoPorto } from "@/functions/process_data/observatorio/porto/passageiro/charts/passageirosPorAnoPorto";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosPortoAno = ({
  data,
  colors = ColorPalette.default,
  title = "Passageiros Durante o Ano",
  months
}: ChartBuild<PortoPassageirosOutputData>) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const yearCur = data.passageiros?.current[0]?.['Data'].split('-')[0] || 'Dado não encontrado'
  const yearPast = data.passageiros?.past[0]?.['Data'].split('-')[0] || 'Dado não encontrado'

  const mesChartData = processPassageirosAnoPorto(data.passageiros.current || [], data.passageiros.past || [])
  const updatedMesData = updatedMonthChartData(mesChartData, months);

  const anoChartData = processPassageirosPorAnoPorto(data.passageiros.porAno ?? []);

  const updatedData = mode === "ano" ? anoChartData : updatedMesData;
  const xKey = mode === "ano" ? "ano" : "mes";

  return (
    <div className="chart-wrapper col-span-full">
      <ChartGrabber>
        <LineChart
          data={updatedData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={colors}
          xKey={xKey}
          lines={
            mode === "ano"
              ? [{ dataKey: "passageiros", name: "Passageiros", strokeWidth: 2 }]
              : [
                  { dataKey: "current", name: yearCur, strokeWidth: 2 },
                  { dataKey: "past", name: yearPast, strokeWidth: 2 },
                ]
          }
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosPortoAno;
