"use client";

import { useEffect, useState } from "react";

import { BalancaComercialData } from "@/@api/http/to-charts/bal_comercial/BalancaComercialData";
import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";
import { ChartBuild } from "@/@types/observatorio/shared";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import { useDashboard } from "@/context/DashboardContext";
import { processValoresImportacaoExportacao } from "@/functions/process_data/observatorio/balanca-comercial/comercial/charts/valoresImportacaoExportacao";
import { processValoresImportacaoExportacaoPorAno } from "@/functions/process_data/observatorio/balanca-comercial/comercial/charts/valoresImportacaoExportacaoPorAno";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { applyGenericFilters } from "@/utils/filters/@features/applyGenericFilters";
import { updatedMonthChartData } from "@/utils/filters/@global/updateMonthChartData";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const CargasAnoComparativo = ({
  data = [],
  dataSemMes,
  colors = [ColorPalette.status.badLine, ColorPalette.status.good],
  title = "Valores Importação e Exportação",
  months
}: ChartBuild<BalancaHeaders[]>) => {
  const [mode, setMode] = useState<"ano" | "mes">("ano");
  const { filters } = useDashboard();
  const [anoData, setAnoData] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new BalancaComercialData("").fetchAllYearsData().then((rows) => {
      if (cancelled) return;
      const filtered = applyGenericFilters(rows, filters, ["Mês"]).filteredData;
      setAnoData(processValoresImportacaoExportacaoPorAno(filtered));
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

  // Usa dataSemMes (ignora o filtro de Mês) — um gráfico de linha nunca deve obedecer ao
  // filtro de mês, senão a série colapsa num ponto só quando um mês é selecionado.
  const mesChartData = updatedMonthChartData(processValoresImportacaoExportacao(dataSemMes ?? data), months ?? 1);
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
        { dataKey: "importacao", name: "Importação" },
        { dataKey: "exportacao", name: "Exportação" },
      ]}
      tooltipEntry=" dólares"
    />
  </ChartGrabber>
</div>

  );
};

export default CargasAnoComparativo;
