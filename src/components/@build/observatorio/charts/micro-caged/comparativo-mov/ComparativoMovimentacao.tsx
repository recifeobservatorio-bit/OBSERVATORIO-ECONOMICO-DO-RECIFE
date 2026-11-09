"use client";

import React, { useEffect, useState } from "react";

import { MicroCagedData } from "@/@api/http/to-charts/micro_caged/MicroCagedData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { useDashboard } from "@/context/DashboardContext";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { anoMesKey, anoMesKeyToLabel } from "@/functions/process_data/observatorio/micro-caged/comparativo-med/getAnoMesValues";
import { geralAccFunction } from "@/functions/process_data/observatorio/rais/demografia/geralFuncition";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ComparativoMovimentacao = ({
  colors = [ColorPalette.status.good, ColorPalette.status.badLine],
  title = "Admissões e Demissões",
  toCompare,
}: any) => {
  const { filters } = useDashboard();
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new MicroCagedData("").fetchAllYearsMicroCaged().then((rows) => {
      if (cancelled) return;
      // Ignora os filtros de grupamento/mês — um gráfico de linha nunca deve obedecer ao
      // filtro de mês, senão a série colapsa num ponto só quando um mês é selecionado.
      const filtered = applyGenericFilters(rows, filters, ["grupamento", "mês"]).filteredData;
      const scoped = filtered
        .filter((r: any) => r["município"] === toCompare)
        .map((r: any) => ({ ...r, __anoMes: anoMesKey(r["Ano"], r["mês"]) }))
        .filter((r: any) => r.__anoMes != null);

      const admitidosByAnoMes = geralAccFunction(scoped.filter((r: any) => r["saldomovimentação"] === "Admitidos"), ["__anoMes"]).__anoMes || {};
      const demitidosByAnoMes = geralAccFunction(scoped.filter((r: any) => r["saldomovimentação"] === "Demitidos"), ["__anoMes"]).__anoMes || {};
      const chaves = Array.from(new Set([...Object.keys(admitidosByAnoMes), ...Object.keys(demitidosByAnoMes)])).sort();
      setChartData(chaves.map((key) => ({ mes: anoMesKeyToLabel(key), admitidos: admitidosByAnoMes[key] || 0, demitidos: demitidosByAnoMes[key] || 0 })));
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
          lines={[{ dataKey: "admitidos", name: "Admitidos", strokeWidth: 2 }, { dataKey: "demitidos", name: "Demitidos", strokeWidth: 2 }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default ComparativoMovimentacao;
