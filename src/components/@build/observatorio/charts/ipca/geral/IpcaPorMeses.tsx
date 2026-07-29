"use client";

import React, { useState } from "react";

import { IpcaGeralHeaders } from "@/@types/observatorio/@fetch/ipca";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { processVariacaoMensal } from "@/functions/process_data/observatorio/ipca/geral/charts/ipcaPorMeses";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";


const IpcaPorMeses = ({
  data = [],
  porAno = [],
  months,
  colors = ColorPalette.default,
  title = "Variação Mensal do IPCA",
  nameKey = "mes",
}: ChartBuild<IpcaGeralHeaders[]> & { porAno?: any[] }) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData = processVariacaoMensal(data);
  const updatedMesData = updatedMonthChartData(mesChartData, months as any);

  // "Ano" exclui Brasil (mesmo critério do modo "Mês") — quem quiser comparar com o
  // Brasil usa o gráfico dedicado (IpcaBrasilPorMeses).
  const anoChartData = porAno.map((row) => {
    const { Brasil, ...capitais } = row;
    return capitais;
  });

  const chartData = mode === "ano" ? anoChartData : updatedMesData;
  const xKey = mode === "ano" ? "ano" : nameKey;
  const categorias = Object.keys(chartData[0] || {}).filter((key) => key !== "mes" && key !== "ano");

  const selectedColors = categorias.map((_, index) => colors[index % colors.length]);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={selectedColors}
          xKey={xKey}
          lines={categorias.map((categoria) => ({
            dataKey: categoria,
            name: categoria,
            strokeWidth: 2,
          }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default IpcaPorMeses;
