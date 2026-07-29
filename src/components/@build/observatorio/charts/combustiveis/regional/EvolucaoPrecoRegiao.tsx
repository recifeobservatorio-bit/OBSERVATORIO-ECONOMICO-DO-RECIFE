"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

const EvolucaoPrecoRegiao = ({ data, title = "Evolução do Preço Médio por Região", colors = ColorPalette.default }: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("ano");

  const anoChartData: any[] = data?.evolucao ?? [];
  const mesChartData: any[] = data?.porMes ?? [];
  const chartData = mode === "ano" ? anoChartData : mesChartData;
  const xKey = mode === "ano" ? "ano" : "mes";

  // "Nordeste" sempre em azul, as demais regiões seguem a paleta padrão
  const lineColors = REGIOES.map((r, i) => (r === "Nordeste" ? "#0155AE" : colors[i % colors.length]));

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={lineColors}
          xKey={xKey}
          tooltipEntry="R$"
          height={500}
          lines={REGIOES.map((r) => ({ dataKey: r, name: r, strokeWidth: 2 }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default EvolucaoPrecoRegiao;
