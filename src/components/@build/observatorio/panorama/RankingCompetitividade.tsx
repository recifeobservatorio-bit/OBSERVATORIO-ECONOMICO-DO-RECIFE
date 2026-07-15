"use client";

import { useEffect, useState } from "react";

import { RankingData } from "@/@api/http/to-charts/ranking/RankingData";
import LineChart from "@/components/@global/charts/LineChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { computeTrendLine } from "@/utils/charts/linearTrend";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const RankingCompetitividade = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    new RankingData("2024").fetchProcessedGeralAllYears().then((rows: any[]) => {
      const recife = rows.filter((r) => r["Município"] === "Recife").sort((a, b) => a.Ano - b.Ano);

      const trend = computeTrendLine(recife.map((r, i) => ({ x: i, y: Number(r["Colocação"]) })));

      setChartData(
        recife.map((r, i) => ({
          ano: r.Ano,
          colocacao: Number(r["Colocação"]),
          tendencia: trend[i],
        }))
      );
    });
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="Ranking Competitividade">
      <LineChart
        data={chartData}
        xKey="ano"
        colors={ColorPalette.default}
        yAxis={{ reversed: true }}
        lines={[
          { dataKey: "colocacao", name: "Colocação" },
          { dataKey: "tendencia", name: "Tendência", showDots: false },
        ]}
      />
    </PanoramaCard>
  );
};

export default RankingCompetitividade;
