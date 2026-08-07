"use client";

import HorizontalScrollableBarChart from "@/components/@global/charts/HorizontalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const MedianaPorZona = ({ data, title = "Valor Médio (Mediana) por Zona", colors = ColorPalette.default }: any) => {
  const chartData = data?.medianaPorZona ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <HorizontalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="zona"
          bars={[{ dataKey: "mediana", name: "Mediana (R$)" }]}
          widthMultiply={190}
          heightToPass={285}
          tooltipEntry="R$"
        />
      </ChartGrabber>
    </div>
  );
};

export default MedianaPorZona;
