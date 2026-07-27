"use client";

import React, { useEffect, useState } from "react";

import { MicroCagedData } from "@/@api/http/to-charts/micro_caged/MicroCagedData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { useDashboard } from "@/context/DashboardContext";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ComparativoMovimentacao = ({
  data = [],
  colors = ColorPalette.default,
  title = "Admissões e Admissões no Ano",
  toCompare,
}: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("ano");
  const { filters } = useDashboard();
  const [anoData, setAnoData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new MicroCagedData("").fetchAllYearsMicroCaged().then((rows) => {
      if (cancelled) return;
      const filtered = applyGenericFilters(rows, filters, ["grupamento", "mês"]).filteredData;
      const scoped = filtered.filter((r: any) => r["município"] === toCompare);
      const admitidosByAno = geralAccFunction(scoped.filter((r: any) => r["saldomovimentação"] === "Admitidos"), ["Ano"]).Ano;
      const demitidosByAno = geralAccFunction(scoped.filter((r: any) => r["saldomovimentação"] === "Demitidos"), ["Ano"]).Ano;
      const anos = Array.from(new Set([...Object.keys(admitidosByAno), ...Object.keys(demitidosByAno)])).sort();
      setAnoData(anos.map((ano) => ({ ano, admitidos: admitidosByAno[ano] || 0, demitidos: demitidosByAno[ano] || 0 })));
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

  const dataCompare = data?.[toCompare]
  const dataAdmitidos = dataCompare?.['admitidos'] || []
  const dataDemitidos = dataCompare?.['demitidos'] || []

  const mesChartData: any[] = []
  for (const key in dataAdmitidos) {
    mesChartData.push({ mes: key, admitidos: dataAdmitidos[key], demitidos: dataDemitidos[key] })
  }

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
          lines={[{ dataKey: "admitidos", name: "Admitidos", strokeWidth: 2 }, { dataKey: "demitidos", name: "Demitidos", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default ComparativoMovimentacao;
