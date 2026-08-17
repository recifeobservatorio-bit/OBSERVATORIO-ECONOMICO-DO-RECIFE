"use client";

import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorConstrucao = ({ data, title = "Quantidade de Transações por Tipo de Construção", colors = ColorPalette.default }: any) => {
  const chartData = data?.porConstrucao ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <VerticalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="tipo"
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

export default PorConstrucao;
