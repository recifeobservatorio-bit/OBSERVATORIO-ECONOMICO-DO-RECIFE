"use client";

import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorRPA = ({ data, title = "Total de Contribuintes do IPTU por RPA", colors = ColorPalette.default }: any) => {
  const chartData = data?.porRPA ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <VerticalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="rpa"
          bars={[{ dataKey: "quantidade", name: "Contribuintes" }]}
          heightPerCategory={40}
          visibleHeight={420}
          widthY={140}
          highlightValues={[]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PorRPA;
