"use client";

import React, { useRef, useState } from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { resizeDiv } from "@/components/@global/features/resizeDiv";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const SaldoInstrucao = ({
  data,
  title = "Saldo por Grau de Instrução",
  year,
}: any) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  resizeDiv(containerRef, width, setWidth)

  const chartData = getObjToArr<number>(data['graudeinstrução'] || {}).sort((a, b) => b.value - a.value)

  return (
    <div ref={containerRef} className="chart-wrapper">
      <ChartGrabber>
        <BarChart
          data={chartData}
          title={title}
          xKey="label"
          bars={[{ dataKey: "value", name: "Quantidade" }]}
          colors={ColorPalette.default}
        />
      </ChartGrabber>
    </div>
  );
};

export default SaldoInstrucao;
