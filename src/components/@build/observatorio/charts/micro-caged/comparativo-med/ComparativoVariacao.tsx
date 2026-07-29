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

const ComparativoVariacao = ({
  data = [],
  colors = ColorPalette.default,
  title = "Variação de Salário Médio (ano)",
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
      const anoRows = processMunicipiosAnoValues(dataMuni, toCompare ?? []);

      // Variação ano contra ano: cada ano comparado com o ano anterior disponível na série,
      // mesmo cálculo do modo "Mês" (que compara com o mesmo mês do ano anterior).
      const anoVariacao = anoRows.map((row, i) => {
        const prev = anoRows[i - 1];
        const result: { ano: string } & { [key: string]: number | string } = { ano: row.ano };
        for (const key in row) {
          if (key === "ano") continue;
          result[key] = prev?.[key] ? Math.round(((row[key] - prev[key]) / prev[key]) * 100 * 100) / 100 : 0;
        }
        return result;
      });

      setAnoData(anoVariacao);
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
  const dataPast = data['past']

  const monthCurrentData = processMunicipiosMonthValues(dataCurrent, toCompare)
  const monthPastData = processMunicipiosMonthValues(dataPast, toCompare) || []

  const monthVariation = monthCurrentData.map((month) => {
    const monthPast = monthPastData.find((obj) => obj['mes'] === month['mes']) || {}

    const dataVariation: { mes: string  } & { [key: string]: number | string } = { mes: ''}

    for (const key in month) {
      if (key === 'mes') dataVariation[key] = month[key] || 'inválido'

      if (!dataVariation[key]) {
        dataVariation[key] = monthPast?.[key] ? Math.round(((month[key] - monthPast[key]) / monthPast[key]) * 100 * 100) / 100 : 0
      };
    }

    return dataVariation
  })

  const mesChartData = monthVariation.map((data) => ({ ...data, order: monthToNumber(data['mes']) })).sort((a, b) => a.order - b.order)

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

export default ComparativoVariacao;
