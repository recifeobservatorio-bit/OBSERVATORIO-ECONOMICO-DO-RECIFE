"use client";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorZona = ({ data, title = "Valor Total do IPTU por Zona", colors = ColorPalette.default }: any) => {
  const chartData = data?.porZona ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="zona"
          bars={[{ dataKey: "valor", name: "Valor Total (R$)" }]}
          widthMultiply={130}
          heightToPass={285}
          tooltipEntry="R$"
        />
      </ChartGrabber>
    </div>
  );
};

export default PorZona;
