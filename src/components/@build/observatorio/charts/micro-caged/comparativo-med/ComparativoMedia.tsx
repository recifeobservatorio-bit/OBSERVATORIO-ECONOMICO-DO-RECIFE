"use client";

import React, { useEffect, useState } from "react";

import { MicroCagedData } from "@/@api/http/to-charts/micro_caged/MicroCagedData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { useDashboard } from "@/context/DashboardContext";
import { getMunicipiosAnoMesData, processMunicipiosAnoMesValues } from "@/functions/process_data/observatorio/micro-caged/comparativo-med/getAnoMesValues";
import { getSmFiltred } from "@/functions/process_data/observatorio/micro-caged/getSmFiltred";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ComparativoMedia = ({
  data = [],
  colors = ColorPalette.default,
  title = "Salário Médio",
  toCompare,
}: any) => {
  const { filters } = useDashboard();
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new MicroCagedData("").fetchAllYearsMicroCaged().then((rows) => {
      if (cancelled) return;
      const filtered = applyGenericFilters(getSmFiltred(rows), filters, ["mês"]).filteredData;
      const dataMuni = getMunicipiosAnoMesData(filtered, toCompare ?? []) || {};
      setChartData(processMunicipiosAnoMesValues(dataMuni, toCompare ?? []));
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

export default ComparativoMedia;
