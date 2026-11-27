"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import { serieMensalEmpresasAtivas } from "./serieMensal";

const VariacaoEmpresasAtivasRecife = ({
  colors = ColorPalette.default,
  title = "Variação Mensal de Empresas Ativas no Recife",
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
          data={serie.filter((p) => p.variacao != null)}
          title={title}
          colors={colors}
          xKey="label"
          lines={[{ dataKey: "variacao", name: "Variação (%)", strokeWidth: 2 }]}
          tooltipEntry="%"
        />
      </ChartGrabber>
    </div>
  );
};

export default VariacaoEmpresasAtivasRecife;
