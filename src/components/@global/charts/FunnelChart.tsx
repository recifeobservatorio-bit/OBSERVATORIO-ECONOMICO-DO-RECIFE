import { useId } from "react";

import { useChartCrossFilter } from "./crossFilterFill";

/**
 * Funil estilo Power BI: barras horizontais centralizadas, do maior para o
 * menor valor, com o rótulo da categoria à esquerda e o valor dentro da barra.
 * data: [{ [nameKey]: "Admissões", [dataKey]: 22230 }, ...]
 */
const FunnelChart = ({
  data,
  title,
  underTitle,
  dataKey = "value",
  nameKey = "label",
  colors = [],
  height = 300,
  sort = true,
  valueFormatter = (v: number) => v.toLocaleString("pt-BR"),
}: any) => {
  const chartId = useId();
  const { visibleData, pickFilter } = useChartCrossFilter(chartId, data, (entry: any) => entry[nameKey], title);

  const rows = (visibleData || []).map((entry: any, index: number) => ({
    name: String(entry[nameKey]),
    value: Number(entry[dataKey]) || 0,
    color: colors[index % Math.max(colors.length, 1)] || "#118DFF",
  }));
  if (sort) rows.sort((a: any, b: any) => Math.abs(b.value) - Math.abs(a.value));
  const max = Math.max(1, ...rows.map((r: any) => Math.abs(r.value)));

  return (
    <div className="relative bg-transparent w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
        {underTitle && <div className="mb-2">{underTitle}</div>}
      </div>
      <div className="bi-chart-box flex flex-col justify-center gap-3 px-3" style={{ height }}>
        {rows.map((row: any) => {
          const pct = Math.max(4, (Math.abs(row.value) / max) * 100);
          return (
            <div
              key={row.name}
              className="flex items-center gap-3 cursor-pointer"
              style={{ flex: "1 1 0", maxHeight: 64 }}
              onClick={() => pickFilter(row.name)}
              title={`${row.name}: ${valueFormatter(row.value)}`}
            >
              <span className="w-24 shrink-0 text-right text-xs font-semibold" style={{ color: "var(--yaxis-tick-color)" }}>
                {row.name}
              </span>
              <div className="flex-1 h-full flex justify-center items-center">
                <div
                  className="h-full flex items-center justify-center text-sm font-semibold rounded-sm"
                  style={{ width: `${pct}%`, background: row.color, color: "#fff", minHeight: 24 }}
                >
                  {pct > 18 ? valueFormatter(row.value) : ""}
                </div>
                {pct <= 18 && (
                  <span className="ml-2 text-sm font-semibold" style={{ color: row.color }}>{valueFormatter(row.value)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelChart;
