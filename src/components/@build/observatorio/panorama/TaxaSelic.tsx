"use client";

import { useEffect, useState } from "react";

import { SelicData } from "@/@api/http/to-charts/selic/SelicData";
import LineChart from "@/components/@global/charts/LineChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import { SelicIcon } from "./icons";
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

  const latest = chartData[chartData.length - 1];

  return (
    <PanoramaCard
      title="Taxa Selic"
      icon={<SelicIcon />}
      metricLabel="Taxa atual"
      metric={latest ? `${Number(latest.taxa).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%` : "-"}
      source="Fonte: Banco Central do Brasil"
    >
      <LineChart
        data={chartData}
        xKey="data"
        colors={ColorPalette.default}
        lines={[{ dataKey: "taxa", name: "Taxa Selic (%)" }]}
        height={340}
      />
    </PanoramaCard>
  );
};

export default TaxaSelic;
