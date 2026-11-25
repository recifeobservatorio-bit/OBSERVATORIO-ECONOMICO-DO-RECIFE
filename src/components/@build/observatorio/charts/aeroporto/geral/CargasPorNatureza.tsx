"use client";

import React, { useState } from "react";

import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import PieChart from "@/components/@global/charts/PieChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { ShowPercentages } from "@/components/@global/features/ShowPercentages";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const CargasPorNatureza = ({
  data = [],
  title = "Cargas por Natureza do Voo (Kg)",
}: ChartBuild<AnacGeralHeaders[]>) => {
  const [showPercentage, setShowPercentage] = useState(true);
  // Soma a CARGA (kg) por natureza do voo (Doméstica / Internacional), como no Power BI.
  const totals: Record<string, number> = {};
  data.forEach((item: any) => {
    const natureza = item["NATUREZA"] || "Indefinida";
    totals[natureza] = (totals[natureza] || 0) + (Number(item["CARGA"]) || 0);
  });
  const chartData = Object.entries(totals)
    .map(([natureza, total]) => ({ natureza, total }))
    .sort((a, b) => b.total - a.total);

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
          dataKey="total"
          nameKey="natureza"
          colors={ColorPalette.default}
          showPercentages={showPercentage}
          tooltipEntry=" kg"
        />
      </ChartGrabber>
    </div>
  );
};

export default CargasPorNatureza;
