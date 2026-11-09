"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { countByAnoMes } from "@/functions/process_data/observatorio/empresas/countByAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasMes = ({
  colors = ColorPalette.default,
  title = "Quantidade de Empresas Inativas no Recife",
  }: any) => {
    const [anoData, setAnoData] = useState<{ label: string; value: number }[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsEmpresasInativas().then((rows) => {
        if (cancelled) return;
        setAnoData(countByAnoMes(rows));
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (!anoData) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    // Série histórica completa (todos os anos), agrupada por mês — um gráfico de linha nunca
    // deve obedecer ao filtro de mês/ano, senão a série colapsa num ponto só. Só ~16,5% dos
    // registros de inativas têm data_encerramento preenchida, mas countByAnoMes já ignora
    // linhas sem Ano em vez de criar um ponto "sem ano".
    const chartData = anoData

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            colors={colors}
            xKey="label"
            lines={[{ dataKey: "value", name: "Empresas Inativas", strokeWidth: 2 }]}
          />
        </ChartGrabber>
      </div>
    );
  };
  
  
  

export default EmpresasMes;
