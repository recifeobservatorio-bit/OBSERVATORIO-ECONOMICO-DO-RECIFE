"use client";

import React, { useEffect, useState } from "react";

import { MicroCagedData } from "@/@api/http/to-charts/micro_caged/MicroCagedData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { useDashboard } from "@/context/DashboardContext";
import { getMunicipiosAnoData } from "@/functions/process_data/observatorio/micro-caged/comparativo-med/getAnoValues";
import { processMunicipiosAnoValues } from "@/functions/process_data/observatorio/micro-caged/comparativo-med/municipiosAnoValues";
import { processMunicipiosMonthValues } from "@/functions/process_data/observatorio/micro-caged/comparativo-med/municipiosMonthValues";
import { getSmFiltred } from "@/functions/process_data/observatorio/micro-caged/getSmFiltred";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { monthToNumber } from "@/utils/formatters/@global/monthToNumber";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ComparativoMedia = ({
  data = [],
  colors = ColorPalette.default,
  title = "Salário Médio",
  toCompare,
}: any) => {
  const [mode, setMode] = useState<"ano" | "mes">("mes");
  const { filters } = useDashboard();
  const [anoData, setAnoData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new MicroCagedData("").fetchAllYearsMicroCaged().then((rows) => {
      if (cancelled) return;
      const filtered = applyGenericFilters(getSmFiltred(rows), filters, ["mês"]).filteredData;
      const dataMuni = getMunicipiosAnoData(filtered, toCompare ?? []) || {};
      setAnoData(processMunicipiosAnoValues(dataMuni, toCompare ?? []));
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

  const dataCurrent = data['current']

  const dataMunicipios = processMunicipiosMonthValues(dataCurrent, toCompare)

  const mesChartData = dataMunicipios.map((data) => ({ ...data, order: monthToNumber(data['mes']) })).sort((a, b) => a.order - b.order)

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

export default ComparativoMedia;
