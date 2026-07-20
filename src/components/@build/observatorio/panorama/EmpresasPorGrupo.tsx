"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import StackerBarChartVertical from "@/components/@global/charts/StackedVerticalBarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { getAccTextGroup } from "@/functions/process_data/observatorio/micro-caged/getAccTextGroup";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const YEAR = "2026";

const EmpresasPorGrupo = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    new EmpresasData(YEAR).fetchProcessedAbertasPorSecao().then((rows: any[]) => {
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
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="Empresas Ativadas por Grupo Econômico">
      <StackerBarChartVertical
        data={chartData}
        xKey="label"
        colors={ColorPalette.default}
        bars={[{ dataKey: "value", name: "Empresas", showPercentage: true }]}
        heightPerCategory={55}
        visibleHeight={300}
        widthY={130}
      />
    </PanoramaCard>
  );
};

export default EmpresasPorGrupo;
