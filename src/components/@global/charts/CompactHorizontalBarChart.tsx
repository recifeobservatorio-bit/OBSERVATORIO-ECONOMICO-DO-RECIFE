import { useId } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import { formatCategoryLabel, tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { resolveCrossFilterFill, useChartCrossFilter } from "./crossFilterFill";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";

// Barra horizontal que SEMPRE mostra todas as categorias dentro da altura
// dada (sem scroll interno) — o Recharts encolhe a espessura das barras
// automaticamente conforme o número de categorias cresce. Pensado para
// tiles de tamanho fixo (estilo BI), diferente do VerticalScrollableBarChart
// (que rola quando há muitas categorias).
const CompactHorizontalBarChart = ({
  data,
  title,
  xKey,
  bars,
  colors = [],
  height = 140,
  widthY = 90,
  tooltipEntry,
  highlightValues = ["Recife"],
  highlightColor,
  showPercentage = false,
}: any) => {
  const chartId = useId();
  const { crossFilterActive, visibleData, select, emphasisOpacity } = useChartCrossFilter(
    chartId,
    data,
    (entry: any) => entry[xKey],
    title,
    { emphasis: true }
  );

  const customTooltipFormatter = (value: any) => tooltipFormatter(value, tooltipEntry || "");
  // Trunca em UMA linha com reticência — nomes longos não devem invadir a
  // área do gráfico nem forçar categorias mais altas que o necessário.
  const yFontSize = 10;
  const charsPerLine = Math.max(6, Math.floor((widthY - 12) / (yFontSize * 0.62)));
  const truncateLabel = (value: any) => {
    const text = formatCategoryLabel(value);
    return text.length > charsPerLine ? `${text.slice(0, Math.max(1, charsPerLine - 1)).trimEnd()}…` : text;
  };
  const total = visibleData.reduce(
    (acc: number, entry: any) => acc + bars.reduce((s: number, bar: any) => s + (Number(entry[bar.dataKey]) || 0), 0),
    0
  );

  return (
    <div className="relative w-full h-full">
      {title && (
        <div className="flex flex-col items-center justify-center">
          <h3 className="bi-chart-title text-center mb-2 font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
      )}
      <ResponsiveContainer className="bi-fixed-h" width="100%" height={height}>
        <RechartsBarChart data={visibleData} layout="vertical" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.5} />
          <XAxis type="number" tickFormatter={yAxisFormatter} tick={{ fontSize: 10, fill: "var(--yaxis-tick-color)" }} orientation="top" />
          <YAxis type="category" dataKey={xKey} tick={{ fontSize: 10, fill: "var(--yaxis-tick-color)" }} interval={0} width={widthY} tickFormatter={truncateLabel} />
          <Tooltip content={(e) => CustomTooltip({ ...e, customTooltipFormatter })} />
          <Legend
            verticalAlign="top"
            align="center"
            iconSize={14}
            content={({ payload }) => <CustomLegend payload={payload} />}
          />
          {bars.map((bar: any, index: number) => (
            <Bar key={index} dataKey={bar.dataKey} name={bar.name} fill={colors[index] || "#000"} radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {visibleData.map((entry: any, dataIndex: number) => (
                <Cell
                  key={`cell-${dataIndex}`}
                  cursor="pointer"
                  fillOpacity={emphasisOpacity(entry)}
                  onClick={() => select(chartId, String(entry[xKey]))}
                  fill={resolveCrossFilterFill({
                    crossFilterActive,
                    defaultFill: colors[index % colors.length],
                    isStaticHighlighted: highlightValues.some((v: string) => String(entry[xKey])?.includes(v)),
                    staticHighlightFill: highlightColor ?? colors[(index % colors.length) + 1],
                  })}
                />
              ))}
              {showPercentage && (
                <LabelList
                  dataKey={bar.dataKey}
                  position="right"
                  formatter={(value: number) => (total ? `${((value / total) * 100).toFixed(1)}%` : "")}
                  style={{ fontSize: 10, fontWeight: 600, fill: "var(--yaxis-tick-color)" }}
                />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompactHorizontalBarChart;
