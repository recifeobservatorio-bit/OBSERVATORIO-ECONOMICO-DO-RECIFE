"use client";

import React, { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { useDashboard } from "@/context/DashboardContext";
import { processPassageirosAno } from "@/functions/process_data/observatorio/aeroporto/geral/charts/passageirosAno";
import { processPassageirosPorAno } from "@/functions/process_data/observatorio/aeroporto/geral/charts/passageirosPorAno";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosAno = ({
  data,
  colors = ColorPalette.default,
  title = "Passageiros ao Longo do Ano",
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
      setAnoData(processPassageirosPorAno(filtered));
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  if (mode === "ano" && !anoData) {
    return (
      <div className="chart-wrapper">
        <GraphSkeleton />
      </div>
    );
  }

  const mesChartData = updatedMonthChartData(processPassageirosAno(data), months ?? 1);
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
          lines={[
            { dataKey: "passageiros", name: "Passageiros", strokeWidth: 2 },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PassageirosAno;
