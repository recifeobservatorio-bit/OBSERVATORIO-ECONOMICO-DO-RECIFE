"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Variação abertura e fechamento de empresas entre Recife e <outro>" do Power BI:
// saldo mensal (abertas − fechadas) de cada município selecionado, na mesma linha do tempo.
const EmpresasVariacaoAberturaFechamento = ({
  municipios = [],
  colors = ColorPalette.default,
  title = "Variação Abertura e Fechamento de Empresas",
}: any) => {
  const [rows, setRows] = useState<{ abertas: any[]; fechadas: any[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([new EmpresasData("").fetchAllYearsAbertas(), new EmpresasData("").fetchAllYearsFechadas()]).then(
      ([abertas, fechadas]) => {
        if (!cancelled) setRows({ abertas, fechadas });
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!rows) return <GraphSkeleton />;

  const selected: string[] = municipios.filter(Boolean);
  const byKey = new Map<number, any>();
  const add = (ano: any, mesRaw: any, municipio: string, delta: number) => {
    const mes = monthOptionIndex(String(mesRaw));
    if (ano == null || mes < 1 || mes > 12) return;
    const key = Number(ano) * 100 + mes;
    if (!byKey.has(key)) {
      const row: any = { label: `${monthShortName(mes)}/${ano}` };
      selected.forEach((m) => (row[m] = 0));
      byKey.set(key, row);
    }
    byKey.get(key)[municipio] += delta;
  };

  rows.abertas.forEach((r: any) => {
    if (selected.includes(r["Município"])) add(r["Ano"], r["mes"], r["Município"], Number(r["Quantidade de Empresas"]) || 0);
  });
  rows.fechadas.forEach((r: any) => {
    if (selected.includes(r["Município"])) add(r["Ano de Baixa"], r["mes"], r["Município"], -(Number(r["Quantidade de Empresas"]) || 0));
  });

  const chartData = Array.from(byKey.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={`${title}${selected.length ? ` - ${selected.join(" x ")}` : ""}`}
          colors={colors}
          xKey="label"
          tooltipEntry=""
          lines={selected.map((m) => ({ dataKey: m, name: `Saldo ${m}`, strokeWidth: 2 }))}
        />
      </ChartGrabber>
    </div>
  );
};

export default EmpresasVariacaoAberturaFechamento;
