"use client";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorRPA = ({ data, title = "Total de Contribuintes do IPTU por RPA", colors = ColorPalette.default }: any) => {
  const chartData = data?.porRPA ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="rpa"
          bars={[{ dataKey: "quantidade", name: "Contribuintes" }]}
          highlightValues={[]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PorRPA;
