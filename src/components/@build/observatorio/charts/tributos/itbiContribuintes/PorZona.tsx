"use client";

import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorZona = ({ data, title = "Total de Imóveis por Zona", colors = ColorPalette.default }: any) => {
  const chartData = data?.porZona ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <VerticalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="zona"
          bars={[{ dataKey: "quantidade", name: "Transações" }]}
          heightPerCategory={40}
          visibleHeight={420}
          widthY={140}
          highlightValues={[]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PorZona;
