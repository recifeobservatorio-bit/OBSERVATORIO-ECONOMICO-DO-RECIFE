"use client";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorRPA = ({ data, title = "Valor Total do IPTU por RPA", colors = ColorPalette.default }: any) => {
  const chartData = data?.porRPA ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="rpa"
          bars={[{ dataKey: "valor", name: "Valor Total (R$)" }]}
          widthMultiply={130}
          heightToPass={285}
          tooltipEntry="R$"
        />
      </ChartGrabber>
    </div>
  );
};

export default PorRPA;
