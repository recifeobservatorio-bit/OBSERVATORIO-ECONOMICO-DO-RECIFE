"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import StackerBarChartVertical from "@/components/@global/charts/StackedVerticalBarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { getAccTextGroup } from "@/functions/process_data/observatorio/micro-caged/getAccTextGroup";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const EmpresasPorGrupo = ({ year }: { year: string }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    setChartData(null);
    new EmpresasData(year).fetchProcessedAbertasPorSecao().then((rows: any[]) => {
      const groups = [
        { name: "Indústria", includes: ["C", "E", "D", "B"], quantity: 0 },
        { name: "Comércio", includes: ["G"], quantity: 0 },
        { name: "Agropecuária", includes: ["A"], quantity: 0 },
        { name: "Construção", includes: ["F"], quantity: 0 },
        { name: "Serviços", includes: ["N", "P", "H", "K", "Q", "I", "J", "S", "M", "R", "L", "O", "U"], quantity: 0 },
      ];

      const dataArr = rows.map((r) => ({ label: r.secao, value: Number(r.Quantidade) || 0 }));
      setChartData(getAccTextGroup(dataArr, groups).sort((a, b) => b.value - a.value));
    });
  }, [year]);

  if (!chartData) return <GraphSkeleton />;

  const hasData = chartData.some((d) => d.value > 0);

  return (
    <PanoramaCard title="Empresas Ativadas por Grupo Econômico">
      {!hasData ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          Sem dados de empresas abertas para {year}.
        </p>
      ) : (
        <StackerBarChartVertical
          data={chartData}
          xKey="label"
          colors={ColorPalette.default}
          bars={[{ dataKey: "value", name: "Empresas", showPercentage: true }]}
          heightPerCategory={55}
          visibleHeight={300}
          widthY={130}
        />
      )}
    </PanoramaCard>
  );
};

export default EmpresasPorGrupo;
