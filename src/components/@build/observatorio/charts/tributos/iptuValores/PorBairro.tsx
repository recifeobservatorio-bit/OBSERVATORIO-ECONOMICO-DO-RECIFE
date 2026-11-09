"use client";

import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PorBairro = ({ data, title = "Valor Total do IPTU por Bairro", colors = ColorPalette.default }: any) => {
  const chartData = data?.porBairro ?? [];

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <VerticalScrollableBarChart
          data={chartData}
          title={title}
          colors={[colors[1]]}
          xKey="bairro"
          bars={[{ dataKey: "valor", name: "Valor Total (R$)" }]}
        />
      </ChartGrabber>
    </div>
  );
};

export default PorBairro;
