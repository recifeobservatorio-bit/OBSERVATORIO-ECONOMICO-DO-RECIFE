"use client";

import React, { useEffect, useState } from "react";

import { MicroCagedData } from "@/@api/http/to-charts/micro_caged/MicroCagedData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { useDashboard } from "@/context/DashboardContext";
import { anoMesKeyToLabel, getMunicipiosAnoMesData } from "@/functions/process_data/observatorio/micro-caged/comparativo-med/getAnoMesValues";
import { getSmFiltred } from "@/functions/process_data/observatorio/micro-caged/getSmFiltred";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ComparativoVariacao = ({
  colors = ColorPalette.default,
  title = "Variação de Salário Médio (ano contra ano)",
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

      // Variação mês contra o mesmo mês do ano anterior, contínua ao longo de toda a
      // série histórica (chave "AAAA-MM" - 12 = mesmo mês, ano anterior).
      const municipios: string[] = (toCompare ?? []).filter((m: string) => dataMuni[m]);
      const allKeys = Array.from(new Set(municipios.flatMap((m) => Object.keys(dataMuni[m])))).sort();

      const variacao = allKeys.map((key) => {
        const [ano, mesIdx] = key.split("-");
        const prevKey = `${Number(ano) - 1}-${mesIdx}`;
        const row: { mes: string } & { [key: string]: number | string } = { mes: anoMesKeyToLabel(key) };
        municipios.forEach((muni) => {
          const atual = dataMuni[muni][key];
          const anterior = dataMuni[muni][prevKey];
          row[muni] = atual != null && anterior ? Math.round(((atual - anterior) / anterior) * 100 * 100) / 100 : 0;
        });
        return row;
      });

      setChartData(variacao);
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

export default ComparativoVariacao;
