"use client";

import { useEffect, useState } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { AenaCargasHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { useDashboard } from "@/context/DashboardContext";
import { processCargaAnoAena } from "@/functions/process_data/observatorio/aeroporto/aena/cargasAnoAena";
import { processCargaPorAnoAena } from "@/functions/process_data/observatorio/aeroporto/aena/cargasPorAnoAena";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const CargasAnoAena = ({
    data = [],
    colors = ColorPalette.default,
    title = "Cargas ao Longo do Ano",
    months
  }: ChartBuild<AenaCargasHeaders[]>) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const { filters } = useDashboard();
    const [anoData, setAnoData] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new AeroportoData("").fetchAllYearsAenaCargas().then((rows) => {
        if (cancelled) return;
        const filtered = applyGenericFilters(rows, filters, ["Mês"]).filteredData;
        setAnoData(processCargaPorAnoAena(filtered));
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

    const mesChartData = updatedMonthChartData(processCargaAnoAena(data), months ?? 1);
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
            lines={[{ dataKey: "quantidade", name: "Cargas (ton)", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default CargasAnoAena;
