"use client";

import { useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const LinhaTransmissoes = ({
  data,
  title = "Quantidade de Transações Imobiliárias",
  colors = ColorPalette.default,
}: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");

  const mesChartData: any[] = data?.linhaTransmissoes ?? [];
  const anoChartData: any[] = data?.linhaTransmissoesPorAno ?? [];
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
          tooltipEntry=""
          lines={[{ dataKey: "quantidade", name: "Transações", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default LinhaTransmissoes;
