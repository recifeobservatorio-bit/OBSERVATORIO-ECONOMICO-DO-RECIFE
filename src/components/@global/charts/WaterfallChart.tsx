import { useId } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { DATA_LABEL_STYLE } from "./biLabels";
import { useChartCrossFilter } from "./crossFilterFill";

/**
 * Cascata (waterfall) estilo Power BI: cada categoria sobe ou desce a partir
 * do acumulado anterior; a última barra ("Total") é o acumulado final.
 * data: [{ [xKey]: "2021", [valueKey]: 3 }, ...]
 */
const WaterfallChart = ({
  data,
  title,
  xKey,
  valueKey,
  height = 340,
  increaseColor = "#52B348",
  decreaseColor = "#E04B4B",
  totalColor = "#12239E",
  showTotal = true,
  totalLabel = "Total",
  valueSuffix = "",
}: any) => {
  const chartId = useId();
  const { visibleData, pickFilter } = useChartCrossFilter(chartId, data, (entry: any) => entry[xKey], title);

  let running = 0;
  const rows = (visibleData || []).map((entry: any) => {
    const value = Number(entry[valueKey]) || 0;
    const start = running;
    running += value;
    return { label: String(entry[xKey]), value, range: [start, running], kind: value >= 0 ? "up" : "down" };
  });
  if (showTotal && rows.length) {
    rows.push({ label: totalLabel, value: running, range: [0, running], kind: "total" });
  }

  const colorOf = (kind: string) => (kind === "total" ? totalColor : kind === "up" ? increaseColor : decreaseColor);
  const fmt = (v: number) => `${v > 0 ? "+" : ""}${v.toLocaleString("pt-BR")}${valueSuffix}`;

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-xs shadow">
        <div className="font-semibold mb-1">{row.label}</div>
        <div style={{ color: colorOf(row.kind) }}>
          {row.kind === "total" ? "Acumulado" : "Variação"}: {fmt(row.value)}
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-transparent w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      <div className="flex justify-center gap-4 text-xs mt-1" style={{ color: "var(--yaxis-tick-color)" }}>
        <span><span className="inline-block w-3 h-3 mr-1 align-middle" style={{ background: increaseColor }} />Aumento</span>
        <span><span className="inline-block w-3 h-3 mr-1 align-middle" style={{ background: decreaseColor }} />Redução</span>
        {showTotal && <span><span className="inline-block w-3 h-3 mr-1 align-middle" style={{ background: totalColor }} />{totalLabel}</span>}
      </div>
      <div className="bi-chart-box" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={rows}
            margin={{ top: 20, right: 20, left: 4, bottom: 10 }}
            onClick={(state: any) => {
              if (state?.activeLabel != null && state.activeLabel !== totalLabel) pickFilter(String(state.activeLabel));
            }}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--yaxis-tick-color)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--yaxis-tick-color)" }} tickFormatter={yAxisFormatter} tickLine={false} axisLine={false} width={50} />
            <Tooltip content={renderTooltip} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <ReferenceLine y={0} stroke="var(--yaxis-tick-color)" strokeOpacity={0.5} />
            <Bar dataKey="range" isAnimationActive={false} maxBarSize={48}>
              {rows.map((row: any, index: number) => (
                <Cell key={index} fill={colorOf(row.kind)} />
              ))}
              <LabelList
                dataKey="value"
                content={({ x, y, width, height: h, value, index }: any) => {
                  const row = rows[index];
                  if (!row) return null;
                  const top = Math.min(Number(y), Number(y) + Number(h));
                  return (
                    <text x={Number(x) + Number(width) / 2} y={top - 6} textAnchor="middle" style={{ ...DATA_LABEL_STYLE, fill: colorOf(row.kind) }}>
                      {row.kind === "total" ? Number(value).toLocaleString("pt-BR") : fmt(Number(value))}
                    </text>
                  );
                }}
              />
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterfallChart;
