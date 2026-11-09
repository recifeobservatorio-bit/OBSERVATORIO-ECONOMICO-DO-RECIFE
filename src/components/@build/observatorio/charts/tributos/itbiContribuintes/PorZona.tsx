"use client";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorZona = ({ data, title = "Total de Imóveis por Zona", colors = ColorPalette.default }: any) => {
  const chartData = data?.porZona ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="zona"
          bars={[{ dataKey: "quantidade", name: "Transações" }]}
          highlightValues={[]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PorZona;
