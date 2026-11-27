"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import { serieMensalEmpresasAtivas } from "./serieMensal";

const EmpresasAtivasMes = ({
  colors = ColorPalette.default,
  title = "Quantidade Total Mensal de Empresas Ativas no Recife",
}: any) => {
  const [serie, setSerie] = useState<any[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    new EmpresasData("").fetchAllYearsEmpresasAtivasRecife().then((rows) => {
      if (!cancelled) setSerie(serieMensalEmpresasAtivas(rows));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!serie) {
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
          data={serie}
          title={title}
          colors={colors}
          xKey="label"
          lines={[{ dataKey: "empresas", name: "Empresas Ativas", strokeWidth: 2 }]}
          
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasAtivasMes;
