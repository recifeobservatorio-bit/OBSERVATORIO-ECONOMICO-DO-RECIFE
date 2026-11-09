import { useId } from "react";
import { BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

import { formatCategoryLabel, tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { categoryAxisLayout, columnThickness, useElementSize } from "./barThickness";
import { DATA_LABEL_STYLE, formatDataLabel } from "./biLabels";
import { resolveCrossFilterFill, useChartCrossFilter } from "./crossFilterFill";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";

const BarChart = ({
  data,
  title,
  colors,
  xKey,
  bars,
  tooltipEntry,
  highlightValues = [],
  highlightColor,
  height = 382,
  legendSquare = false,
  maxBarSize = 120,
}: any) => {
  const chartId = useId();
  const { crossFilterActive, visibleData, select, emphasisOpacity } = useChartCrossFilter(
    chartId,
    data,
    (entry: any) => entry[xKey],
    title,
    { emphasis: true }
  );

  // Colunas finas (~7 por largura de gráfico). 24 = margens (eixo Y oculto).
  const [boxRef, boxSize] = useElementSize<HTMLDivElement>();
  const thickness = columnThickness(boxSize && boxSize.width - 24);
  const barMax = Math.min(maxBarSize, thickness ?? maxBarSize);

  const customTooltipFormatter = (value: any) => {
      return tooltipFormatter(value, tooltipEntry || "");
    };

    // Com muitas categorias os rótulos não cabem lado a lado — Recharts some com
    // alguns silenciosamente a menos que a gente force interval={0}. Nesse caso
    // também inclinamos o texto pra caber sem sobrepor.
    const manyCategories = visibleData.length > 6;

    // Trunca nomes longos em UMA linha com reticência — sem isso o rótulo
    // (mesmo inclinado) empurrava as colunas pra bem longe umas das outras.
    const xLabelMaxChars = manyCategories ? 14 : 18;
    const truncateXLabel = (value: any) => {
      const text = formatCategoryLabel(value);
      return text.length > xLabelMaxChars ? `${text.slice(0, xLabelMaxChars - 1).trimEnd()}…` : text;
    };

    // Inclina e reserva altura só quando os rótulos precisam (ver categoryAxisLayout).
    const xAxisLayout = categoryAxisLayout(
      visibleData.map((entry: any) => truncateXLabel(entry[xKey])),
      boxSize ? (boxSize.width - 24) / Math.max(1, visibleData.length) : null
    );

    return (
      <div className="relative w-full h-full">
        <div className="flex flex-col items-center justify-center">
          <h3 className="bi-chart-title text-center mb-4 font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <div ref={boxRef} className="bi-chart-box" style={{ height: height }}>
<ResponsiveContainer width="100%" height="100%">
          {/* Estilo Power BI: valor escrito no topo de cada coluna, sem eixo de
              valores nem grade (o eixo Y fica oculto só pra manter a escala). */}
          <RechartsBarChart data={visibleData} margin={{ top: 22, right: 12, left: 12, bottom: 5 }}>
            <XAxis
              tickLine={false}
              axisLine={{ stroke: "var(--yaxis-tick-color)", strokeOpacity: 0.4 }}
              dataKey={xKey}
              interval={0}
              tick={{ fontSize: 12, fill: "var(--yaxis-tick-color)" }}
              angle={xAxisLayout.angle}
              textAnchor={xAxisLayout.angle ? "end" : "middle"}
              height={xAxisLayout.height}
              tickFormatter={truncateXLabel}
            />
            {/* Folga de 12% no topo: o rótulo da coluna mais alta subia pra cima da legenda. */}
            <YAxis hide domain={[0, (dataMax: number) => dataMax * 1.12]} tickFormatter={yAxisFormatter} />
            <Tooltip
              content={(e) => CustomTooltip({...e, customTooltipFormatter})}
            />
            <Legend
              verticalAlign="top"
              align="center"
              content={({ payload }) => <CustomLegend payload={payload} square={legendSquare} />}
              iconSize={20}
            />
            {bars.map((bar: any, index: any) => (
              <Bar key={index} dataKey={bar.dataKey} fill={colors[index]} name={bar.name} stackId={bar.stackId} radius={bar.radius ?? [2, 2, 0, 0]} maxBarSize={barMax} minPointSize={2} isAnimationActive={false}>
                <LabelList
                  dataKey={bar.dataKey}
                  position={bar.stackId ? "center" : "top"}
                  formatter={formatDataLabel}
                  style={bar.stackId ? { ...DATA_LABEL_STYLE, fill: "#fff" } : DATA_LABEL_STYLE}
                />
                {visibleData.map((entry: any, dataIndex: number) => (
                  <Cell
                    key={`cell-${dataIndex}`}
                    cursor="pointer"
                    fillOpacity={emphasisOpacity(entry)}
                    onClick={() => select(chartId, String(entry[xKey]))}
                    fill={resolveCrossFilterFill({
                      crossFilterActive,
                      defaultFill: colors[index],
                      isStaticHighlighted: highlightValues.some((v: string) => entry[xKey]?.includes(v)),
                      staticHighlightFill: highlightColor,
                    })}
                  />
                ))}
              </Bar>
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
</div>
      </div>
    );
};

export default BarChart;
