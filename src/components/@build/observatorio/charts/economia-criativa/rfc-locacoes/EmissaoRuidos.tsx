"use client";

import React, { useState } from "react";

import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { ShowPercentages } from "@/components/@global/features/ShowPercentages";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmissaoRuidos = ({ data = [], title = "Emissão de Ruídos" }: any) => {
  const [showPercentage, setShowPercentage] = useState(true);
  const acc = geralAccFunction(data, ["EMISSÃO DE RUIDO"]);
  const chartData = getObjToArr<number>(acc["EMISSÃO DE RUIDO"] || {});

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <PieChart
          data={chartData}
          title={title}
          underTitle={<ShowPercentages showPercentage={showPercentage} setShowPercentage={setShowPercentage} />}
          dataKey="value"
          nameKey="label"
          colors={ColorPalette.default}
          showPercentages={showPercentage}
          tooltipEntry=""
        />
      </ChartGrabber>
    </div>
  );
};

export default EmissaoRuidos;
