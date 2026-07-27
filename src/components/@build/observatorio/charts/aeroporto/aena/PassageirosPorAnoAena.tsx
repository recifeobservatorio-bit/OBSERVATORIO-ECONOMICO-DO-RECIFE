"use client";

import { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AenaPassageirosHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { useDashboard } from "@/context/DashboardContext";
import { processPassageirosAnoAena } from "@/functions/process_data/observatorio/aeroporto/aena/passageirosAnoAena";
import { processPassageirosPorAnoAena } from "@/functions/process_data/observatorio/aeroporto/aena/passageirosPorAnoAena";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PassageirosAnoAena = ({
  data = [],
  colors = ColorPalette.default,
  title = "Passageiros ao Longo do Ano",
  months
  }: ChartBuild<AenaPassageirosHeaders[]>) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const { filters } = useDashboard();
    const [anoData, setAnoData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new AeroportoData("").fetchAllYearsAenaPassageiros().then((rows) => {
        if (cancelled) return;
        const filtered = applyGenericFilters(rows, filters, ["Mês"]).filteredData;
        setAnoData(processPassageirosPorAnoAena(filtered));
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

    const mesChartData = updatedMonthChartData(processPassageirosAnoAena(data), months ?? 1);
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
            lines={[{ dataKey: "passageiros", name: "Passageiros", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default PassageirosAnoAena;
