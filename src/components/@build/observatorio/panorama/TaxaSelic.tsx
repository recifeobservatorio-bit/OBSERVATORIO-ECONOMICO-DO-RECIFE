"use client";

import { useEffect, useState } from "react";

import { SelicData } from "@/@api/http/to-charts/selic/SelicData";
import LineChart from "@/components/@global/charts/LineChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const TaxaSelic = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    new SelicData().fetchProcessedData().then((rows: any[]) => {
      setChartData(
        rows.map((r) => ({
          data: new Date(r.Data).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
          taxa: r.Taxa,
        }))
      );
    });
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="Taxa Selic">
      <LineChart
        data={chartData}
        xKey="data"
        colors={ColorPalette.default}
        lines={[{ dataKey: "taxa", name: "Taxa Selic (%)" }]}
      />
    </PanoramaCard>
  );
};

export default TaxaSelic;
