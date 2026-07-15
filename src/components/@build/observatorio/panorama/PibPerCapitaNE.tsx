"use client";

import { useEffect, useState } from "react";

import { PibData } from "@/@api/http/to-charts/pib/PibData";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import PanoramaCard from "./PanoramaCard";

const YEAR = "2023";

const NE_CAPITALS: Record<string, string> = {
  PE: "Recife",
  BA: "Salvador",
  CE: "Fortaleza",
  MA: "São Luís",
  PI: "Teresina",
  RN: "Natal",
  PB: "João Pessoa",
  AL: "Maceió",
  SE: "Aracaju",
};

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const PER_CAPITA_FIELD = "Produto Interno Bruto per capita,  a preços correntes (R$ 1,00)";

const PibPerCapitaNE = () => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    new PibData(YEAR).fetchProcessedData().then((rows: any[]) => {
      const capitais = rows.filter((r) => {
        if (String(r.Ano) !== YEAR || r["Nome da Grande Região"] !== "Nordeste") return false;
        const municipioUf = String(r["Município - UF"] || "");
        const parts = municipioUf.split(" - ");
        const uf = parts[parts.length - 1];
        const cidade = parts.slice(0, -1).join(" - ");
        const capital = NE_CAPITALS[uf];
        return capital && normalize(cidade) === normalize(capital);
      });

      const data = capitais
        .map((r) => ({
          label: r["Município - UF"],
          value: Number(r[PER_CAPITA_FIELD]) || 0,
        }))
        .sort((a, b) => b.value - a.value);

      setChartData(data);
    });
  }, []);

  if (!chartData) return <GraphSkeleton />;

  return (
    <PanoramaCard title="Recife: Maior PIB per capita entre as capitais do NE">
      <VerticalScrollableBarChart
        data={chartData}
        xKey="label"
        colors={ColorPalette.default}
        bars={[{ dataKey: "value", name: "PIB per capita (R$)" }]}
        highlightValues={["Recife"]}
        visibleHeight={300}
        widthY={130}
      />
    </PanoramaCard>
  );
};

export default PibPerCapitaNE;
