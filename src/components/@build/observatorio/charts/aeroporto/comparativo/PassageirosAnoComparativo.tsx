"use client";

import React, { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { useDashboard } from "@/context/DashboardContext";
import { processPassageirosAnoComparativo } from "@/functions/process_data/observatorio/aeroporto/comparativo/passageirosAnoComparativo";
import { processPassageirosPorAnoComparativo } from "@/functions/process_data/observatorio/aeroporto/comparativo/passageirosPorAnoComparativo";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosAnoComparativo = ({
  data,
  colors = ColorPalette.default,
  title = "Passageiros ao Longo do Ano",
  toCompare,
  months
}: ChartBuild<AnacGeralHeaders[]>) => {
  const [mode, setMode] = useState<"ano" | "mes">("ano");
  const { filters } = useDashboard();
  const [anoData, setAnoData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new AeroportoData("").fetchAllYearsAnac().then((rows) => {
      if (cancelled) return;
      const filtered = applyGenericFilters(rows, filters, ["MÊS"]).filteredData;
      setAnoData(processPassageirosPorAnoComparativo(filtered, toCompare ?? []));
    });
    return () => {
      cancelled = true;
    };
  }, [filters, toCompare]);

  if (mode === "ano" && !anoData) {
    return (
      <div className="chart-wrapper">
        <GraphSkeleton />
      </div>
    );
  }

  const mesChartData = updatedMonthChartData(processPassageirosAnoComparativo(data, toCompare ?? []), months ?? 1);
  const chartData = mode === "ano" ? anoData : mesChartData;
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
          lines={[...getDateKeys(toCompare ?? [])]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosAnoComparativo;
