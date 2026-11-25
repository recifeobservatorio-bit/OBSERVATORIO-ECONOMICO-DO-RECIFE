"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { useDashboard } from "@/context/DashboardContext";
import { getAccTextGroup } from "@/functions/process_data/observatorio/micro-caged/getAccTextGroup";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Total de empresas ativas por grupamento - Recife" do Power BI (aba Natureza
// Jurídica): os dados de natureza não têm a seção da CNAE, então este gráfico
// lê a base de classes (estoque por seção) do mesmo ano/mês e agrupa as seções
// em Serviços / Comércio / Indústria / Construção / Agropecuária.
const GROUPS = [
  { name: "Serviços", includes: ["N", "P", "H", "K", "Q", "I", "J", "S", "M", "R", "L", "O", "U"], quantity: 0 },
  { name: "Comércio", includes: ["G"], quantity: 0 },
  { name: "Indústria", includes: ["C", "E", "D", "B"], quantity: 0 },
  { name: "Construção", includes: ["F"], quantity: 0 },
  { name: "Agropecuária", includes: ["A"], quantity: 0 },
];

const EmpresasGrupamento = ({ title = "Total de Empresas Ativas por Grupamento - Recife" }: any) => {
  const { filters } = useDashboard();
  const year = String(getYearSelected(filters) ?? "");
  const selectedMonth = getMonths(filters, true)?.selected?.[0];
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    if (!year) return;
    let cancelled = false;
    setChartData(null);
    new EmpresasData(year).fetchProcessedClasses().then((rows: any[]) => {
      if (cancelled) return;
      const recife = rows.filter((r) => String(r.Municipio).toLowerCase() === "recife");
      // Estoque: usa um mês só (o filtrado ou o último disponível), senão somaria os meses.
      const months = recife.map((r) => monthOptionIndex(String(r.mes))).filter((m) => m >= 1 && m <= 12);
      const month = selectedMonth != null ? monthOptionIndex(String(selectedMonth)) : Math.max(0, ...months);
      const bySecao: Record<string, number> = {};
      recife
        .filter((r) => monthOptionIndex(String(r.mes)) === month)
        .forEach((r) => {
          bySecao[r.secao] = (bySecao[r.secao] || 0) + (Number(r.Estabelecimentos) || 0);
        });
      const arr = Object.entries(bySecao).map(([label, value]) => ({ label, value }));
      const groups = GROUPS.map((g) => ({ ...g, quantity: 0 }));
      setChartData(getAccTextGroup(arr, groups).sort((a: any, b: any) => b.value - a.value));
    });
    return () => {
      cancelled = true;
    };
  }, [year, selectedMonth]);

  if (!chartData) return <GraphSkeleton />;

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Empresas ativas" }]}
          colors={ColorPalette.default}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasGrupamento;
