"use client";

import React from "react";

import FunnelChart from "@/components/@global/charts/FunnelChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processAccValues } from "@/functions/process_data/observatorio/empregos/caged/cagedAccValues";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Funil como no Power BI ("Evolução de empregos"): Admissões, Demissões e Saldo.
const RelatorioGeral = ({
  data,
  title = "Evolução de Empregos",
  year,
}: any) => {
  const chartData = processAccValues(data['caged'])

  // processAccValues ordena por valor, então a cor precisa seguir o rótulo, não o índice.
  const colorByLabel: Record<string, string> = {
    "Admissão": ColorPalette.status.good,
    "Demissão": ColorPalette.status.bad,
    "Saldo": ColorPalette.status.neutral,
  };
  const colors = chartData.map((entry: any) => colorByLabel[entry.label] ?? ColorPalette.default[0]);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <FunnelChart
          data={chartData}
          title={title}
          dataKey="value"
          nameKey="label"
          colors={colors}
          sort={false}
        />
      </ChartGrabber>
    </div>
  );
};

export default RelatorioGeral;
