"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const MedianaAvaliacoes = ({ data, title = "Mediana das Avaliações dos Imóveis", colors = ColorPalette.default }: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData: any[] = data?.medianaAvaliacoes ?? [];
  const anoChartData: any[] = data?.medianaAvaliacoesPorAno ?? [];
  const chartData = mode === "ano" ? anoChartData : mesChartData;
  const xKey = mode === "ano" ? "ano" : "mes";

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
          colors={colors}
          xKey={xKey}
          tooltipEntry="R$"
          lines={[{ dataKey: "mediana", name: "Mediana (R$)", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default MedianaAvaliacoes;
