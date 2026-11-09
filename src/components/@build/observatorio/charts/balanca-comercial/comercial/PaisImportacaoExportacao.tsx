"use client";

import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";
import { ChartBuild } from "@/@types/observatorio/shared";
import StackerBarChartVertical from "@/components/@global/charts/StackedVerticalBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processImportacaoExportacaoPorPais } from "@/functions/process_data/observatorio/balanca-comercial/comercial/charts/paisesImportacaoExportacao";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const ImportacaoExportacaoPorPais = ({
  data = [],
  colors = [ColorPalette.status.bad, ColorPalette.status.good],
}: ChartBuild<BalancaHeaders[]>) => {
  const chartData = processImportacaoExportacaoPorPais(data);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <StackerBarChartVertical
        data={chartData}
        title="Importação vs Exportação por País"
        colors={colors}
        xKey="pais"
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
        heightPerCategory={36}  // Define a altura de cada categoria (barra)
        visibleHeight={400}  // Ajuste a altura do scroll
        left={0}
        widthY={100}
      />
      </ChartGrabber>
      
    </div>
  );
};

export default ImportacaoExportacaoPorPais;
