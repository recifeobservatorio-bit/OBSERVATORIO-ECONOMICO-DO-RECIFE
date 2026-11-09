"use client";

import React, { useState } from "react";

import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { ShowPercentages } from "@/components/@global/features/ShowPercentages";
import { processAccValues } from "@/functions/process_data/observatorio/empregos/caged/cagedAccValues";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const RelatorioGeral = ({
  data,
  title = "Evolução de Empregos",
  year,
}: any) => {
  const [showPercentage, setShowPercentage] = useState(true);
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
        <PieChart
          data={chartData}
          title={title}
          underTitle={
            <ShowPercentages
              showPercentage={showPercentage}
              setShowPercentage={setShowPercentage}
            />
          }
          dataKey="value"
          nameKey="label"
          colors={colors}
          showPercentages={showPercentage}
          tooltipEntry=""
        />
      </ChartGrabber>
    </div>
  );
};

export default RelatorioGeral;
