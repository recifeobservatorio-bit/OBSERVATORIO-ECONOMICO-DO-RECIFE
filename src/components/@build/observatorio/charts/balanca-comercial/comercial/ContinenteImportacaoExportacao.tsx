"use client";

import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";
import { ChartBuild } from "@/@types/observatorio/shared";
import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processImportacaoExportacaoPorContinente } from "@/functions/process_data/observatorio/balanca-comercial/comercial/charts/continentesImportacaoExportacao";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ImportacaoExportacaoContinente = ({
  data = [],
  colors = [ColorPalette.status.bad, ColorPalette.status.good],
  title="Importação vs Exportação por Continente"
}: ChartBuild<BalancaHeaders[]>) => {
  const chartData = processImportacaoExportacaoPorContinente(data);

  // console.log('Balanca comercial ->', chartData)
  // continente: "Ásia"
  // exportacao: 1973084
  // importacao: 87879680

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
        data={chartData}
        title={title}
        colors={colors}
        xKey="continente"
        bars={[
          {
            dataKey: "importacao",
            name: "Importação",
            showPercentage: true,
            percentageField: "percentualImportacao",
          },
          {
            dataKey: "exportacao",
            name: "Exportação",
            showPercentage: true,
            percentageField: "percentualExportacao",
          },
        ]}
        tooltipEntry=" dólares"
      />
      </ChartGrabber>
    </div>
  );
};

export default ImportacaoExportacaoContinente;
