"use client";

import React, { useMemo, useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { processDesempregoTaxaAno, withGapBridge } from "@/functions/process_data/observatorio/empregos/desemprego/desempregoTaxaAno";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const capitalName = (value: string) => String(value).replace(/-[A-Z]{2}$/, "");

// "Selecione uma capital que deseja comparar com o Recife" do Power BI:
// a capital do filtro (Recife por padrão) x uma capital escolhida aqui.
const TaxaDesempregoComparativo = ({
  data,
  colors = [ColorPalette.status.badLine, ColorPalette.default[1]],
  title = "Taxa de Desemprego - Comparação entre Capitais",
}: any) => {
  const baseRows: any[] = data?.historico?.capital ?? [];
  const allRows: any[] = data?.historico?.todas ?? [];

  const baseCapitals = Array.from(new Set(baseRows.map((r) => r.Capital))) as string[];
  const baseLabel = baseCapitals.length === 1 ? capitalName(baseCapitals[0]) : "Média das capitais";

  const options = useMemo(
    () =>
      (Array.from(new Set(allRows.map((r) => r.Capital))) as string[])
        .filter((c) => c && c !== "Brasil" && !baseCapitals.includes(c))
        .sort((a, b) => a.localeCompare(b, "pt-BR")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allRows, baseCapitals.join("|")]
  );
  const [chosen, setChosen] = useState<string>("");
  const compare = options.includes(chosen) ? chosen : options.find((c) => /^Fortaleza/.test(c)) ?? options[0] ?? "";

  // Vão 2º tri/2020–1º tri/2022 (taxa 0 na base = sem dado): ponte tracejada em cada capital.
  const chartData = withGapBridge(
    withGapBridge(processDesempregoTaxaAno(baseRows, allRows.filter((r) => r.Capital === compare)), "value", "semDadoBase"),
    "brasil",
    "semDadoOutra"
  );
  const hasGap = chartData.some((d: any) => d.semDadoBase != null || d.semDadoOutra != null);

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={
            <label className="text-xs flex items-center gap-2" style={{ color: "var(--yaxis-tick-color)" }}>
              Comparar com:
              <select
                className="border rounded px-2 py-1 text-xs bg-white dark:bg-[#0C1A28] dark:border-gray-600"
                value={compare}
                onChange={(e) => setChosen(e.target.value)}
              >
                {options.map((c) => (
                  <option key={c} value={c}>{capitalName(c)}</option>
                ))}
              </select>
            </label>
          }
          colors={hasGap ? [colors[0], colors[1], colors[0], colors[1]] : colors}
          xKey="label"
          lines={[
            { dataKey: "value", name: baseLabel, connectNulls: false },
            { dataKey: "brasil", name: capitalName(compare), connectNulls: false },
            ...(hasGap
              ? [
                  { dataKey: "semDadoBase", name: "Sem dado na base", dashed: true, connectNulls: false, hideInTooltip: true },
                  { dataKey: "semDadoOutra", name: "Sem dado na base", dashed: true, connectNulls: false, hideInTooltip: true, hideInLegend: true },
                ]
              : []),
          ]}
          tooltipEntry="%"
          yAxis={{ tickFormatter: (value: any) => `${value}%` }}
          height={400}
        />
      </ChartGrabber>
    </div>
  );
};

export default TaxaDesempregoComparativo;
