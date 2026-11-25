"use client";

import React, { useMemo, useState } from "react";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// "Selecione um município que deseja comparar com o Recife" do Power BI (CAGED Geral):
// saldo mensal do recorte filtrado (Recife por padrão) x um município escolhido aqui.
// Municipio já vem como "Recife-PE".
const labelOf = (r: any) => String(r.Municipio);

const SaldoComparativo = ({
  data,
  colors = [ColorPalette.default[0], ColorPalette.default[2]],
  title = "Saldo de Empregos - Comparação entre Municípios",
}: any) => {
  const base: any[] = data?.municipiosPorMes ?? [];
  const all: any[] = data?.allYears ?? [];
  const baseNames = Array.from(new Set((Array.isArray(data?.municipios) ? data.municipios : data?.municipios?.filteredData ?? []).map((r: any) => r.Municipio))) as string[];
  const baseLabel = baseNames.length === 1 ? baseNames[0] : "Seleção atual";

  const options = useMemo(() => {
    const seen = new Map<string, string>();
    all.forEach((r) => {
      const code = String(r["Código"]);
      if (!seen.has(code)) seen.set(code, labelOf(r));
    });
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }, [all]);

  const defaultCode = options.find(([, l]) => l === "Olinda-PE")?.[0] ?? options[0]?.[0] ?? "";
  const [text, setText] = useState("");
  const typed = options.find(([, l]) => l.toLowerCase() === text.trim().toLowerCase());
  const code = typed?.[0] ?? defaultCode;
  const compareLabel = options.find(([c]) => c === code)?.[1] ?? "";

  const chartData = useMemo(() => {
    const other = new Map<string, number>();
    all.forEach((r) => {
      if (String(r["Código"]) !== code) return;
      const key = `${Number(r.Ano)}-${Number(r.Mes)}`;
      other.set(key, (other.get(key) || 0) + (Number(r.Saldos) || 0));
    });
    const rows = new Map<string, any>();
    base.forEach((b) => rows.set(`${b.Ano}-${b.Mes}`, { Ano: b.Ano, Mes: b.Mes, label: b["Mês"], base: b.Saldos, outro: null }));
    other.forEach((v, key) => {
      const [ano, mes] = key.split("-").map(Number);
      const row = rows.get(key) ?? { Ano: ano, Mes: mes, label: `${monthShortName(mes)}/${ano}`, base: null };
      row.outro = v;
      rows.set(key, row);
    });
    return Array.from(rows.values()).sort((a, b) => a.Ano - b.Ano || a.Mes - b.Mes);
  }, [all, base, code]);

  const listId = "saldo-comparativo-municipios";

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={chartData}
          title={title}
          underTitle={
            <label className="text-xs flex items-center gap-2" style={{ color: "var(--yaxis-tick-color)" }}>
              Comparar com:
              <input
                list={listId}
                className="border rounded px-2 py-1 text-xs w-48 bg-white dark:bg-[#0C1A28] dark:border-gray-600"
                placeholder={compareLabel}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <datalist id={listId}>
                {options.map(([c, l]) => (
                  <option key={c} value={l} />
                ))}
              </datalist>
            </label>
          }
          colors={colors}
          xKey="label"
          lines={[
            { dataKey: "base", name: `Saldo ${baseLabel}` },
            { dataKey: "outro", name: `Saldo ${compareLabel}` },
          ]}
        />
      </ChartGrabber>
    </div>
  );
};

export default SaldoComparativo;
