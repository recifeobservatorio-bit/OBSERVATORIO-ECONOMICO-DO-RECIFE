"use client";

import React, { useState } from "react";

import { IpcaGeralHeaders } from "@/@types/observatorio/@fetch/ipca";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { processBrasilVariacaoMensal } from "@/functions/process_data/observatorio/ipca/geral/charts/ipcaBrasilPorMeses";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const IpcaPorMeses = ({
  data = [],
  porAno = [],
  nameKey = "mes",
  colors = ColorPalette.default,
  title = "Variação Mensal do IPCA no Brasil",
  months,
}: ChartBuild<IpcaGeralHeaders[]> & { porAno?: any[] }) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData = processBrasilVariacaoMensal(data);
  const updatedMesData = updatedMonthChartData(mesChartData, months ?? 1);

  const anoChartData = porAno.map((row) => ({ ano: row.ano, variaçãoMensal: row.Brasil }));

  const chartData = mode === "ano" ? anoChartData : updatedMesData;
  const xKey = mode === "ano" ? "ano" : nameKey;

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={colors.slice(2)}
          xKey={xKey}
          lines={[
            { dataKey: "variaçãoMensal", name: "Variação Mensal (%)", strokeWidth: 2 },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default IpcaPorMeses;