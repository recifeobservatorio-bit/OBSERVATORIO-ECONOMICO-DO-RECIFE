"use client";

import React, { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { useDashboard } from "@/context/DashboardContext";
import { processPassageirosPorMesComparativo } from "@/functions/process_data/observatorio/aeroporto/comparativo/passageirosPorMesComparativo";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosAnoComparativo = ({
  colors = ColorPalette.default,
  title = "Passageiros ao Longo do Ano",
  toCompare,
}: ChartBuild<AnacGeralHeaders[]>) => {
  const { filters } = useDashboard();
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Série histórica completa (todos os anos) — um gráfico de linha nunca deve obedecer
    // ao filtro de ano/mês, senão a série colapsa num ponto só ou fica restrita a um ano.
    new AeroportoData("").fetchAllYearsAnac().then((rows) => {
      if (cancelled) return;
      const filtered = applyGenericFilters(rows, filters, ["MÊS"]).filteredData;
      setChartData(processPassageirosPorMesComparativo(filtered, toCompare ?? []));
    });
    return () => {
      cancelled = true;
    };
  }, [filters, toCompare]);

  if (!chartData) {
    return (
      <div className="chart-wrapper">
        <GraphSkeleton />
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          colors={colors}
          xKey="mes"
          lines={[...getDateKeys(toCompare ?? [])]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosAnoComparativo;
