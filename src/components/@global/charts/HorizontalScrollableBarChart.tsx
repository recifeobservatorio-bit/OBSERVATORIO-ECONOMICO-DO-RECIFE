import { useId } from "react";
import { BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

import { formatCategoryLabel, tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { BAR_FILL, categoryAxisLayout, useElementSize } from "./barThickness";
import { DATA_LABEL_STYLE, formatDataLabel } from "./biLabels";
import { resolveCrossFilterFill, useChartCrossFilter } from "./crossFilterFill";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";

// Largura mínima por categoria e espessura máxima da coluna.
const MIN_SLOT = 34;
const MAX_COLUMN = 40;

const HorizontalScrollableBarChart = ({
  data,
  title,
  colors,
  xKey,
  bars,
  widthMultiply,
  heightToPass,
  tooltipEntry,
  yDomain,
  xAxisOrientation = "bottom",
  height = 362,
  maxBarSize = 64,
  xAxisFontSize = 12,
}: any) => {
  const chartId = useId();
  const { crossFilterActive, visibleData, select, emphasisOpacity } = useChartCrossFilter(
    chartId,
    data,
    (entry: any) => entry[xKey],
    title,
    { emphasis: true }
  );

  // Gráfico completo: se todas as categorias cabem na largura visível (pelo
  // menos MIN_SLOT px cada, pros rótulos inclinados não se sobreporem), elas
  // dividem a largura toda e não há rolagem lateral. Senão rola, com MIN_SLOT
  // por categoria. Coluna = 60% do espaço, no máximo MAX_COLUMN px (com poucas
  // categorias não vira um bloco). 24 = margens (eixo Y oculto).
  const [scrollBoxRef, scrollBoxSize] = useElementSize<HTMLDivElement>();
  const visibleWidth = scrollBoxSize?.width ?? null;
  const plotWidth = visibleWidth ? visibleWidth - 24 : null;
  const fitsAll = plotWidth !== null && visibleData.length * MIN_SLOT <= plotWidth;
  const slotWidth = plotWidth === null ? widthMultiply : fitsAll ? plotWidth / Math.max(1, visibleData.length) : MIN_SLOT;
  const contentWidth = fitsAll ? visibleWidth! - 2 : Math.max(visibleData.length * slotWidth + 24, visibleWidth ?? 0);
  const barMax = Math.min(maxBarSize, MAX_COLUMN, Math.max(6, Math.round(slotWidth * BAR_FILL)));

  const customTooltipFormatter = (value: any) => {
      return tooltipFormatter(value, tooltipEntry || "");
    };

    // Trunca em UMA linha com reticência — nome completo continua disponível
    // no tooltip ao passar o mouse na coluna.
    const truncateXLabel = (value: any) => {
      const text = formatCategoryLabel(value);
      return text.length > 16 ? `${text.slice(0, 15).trimEnd()}…` : text;
    };
    const xAxisLayout = categoryAxisLayout(
      visibleData.map((entry: any) => truncateXLabel(entry[xKey])),
      slotWidth,
      xAxisFontSize
    );

    return (
      <div className="relative w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center mb-4 font-semibold w-[90%] text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
        {/* Wrapper div with horizontal scroll */}
        <div ref={scrollBoxRef} className="overflow-x-auto">
          {/* Adding a larger width to the ResponsiveContainer */}
          <div style={{ width: fitsAll ? "100%" : contentWidth + "px" }}>
            <div className="bi-chart-box" style={{ height: height }}>
<ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={visibleData}
                margin={
                  xAxisOrientation === "bottom"
                    // O XAxis já reserva 70px pros rótulos inclinados; a margem de 70
                    // somava outros 70px vazios no rodapé (colunas espremidas no alto).
                    // Rótulo inclinado do 1º item avança pra esquerda — sem folga
                    // ele era cortado ("…arulhos" em vez de "Guarulhos").
                    ? { top: 22, right: 12, left: xAxisLayout.angle ? 40 : 12, bottom: 8 }
                    : { top: 50, right: 20, left: 13, bottom: 15 }
                }
              >
                {/* Estilo Power BI: valor no topo da coluna, sem eixo Y nem grade. */}
                <XAxis
                  dataKey={xKey}
                  tickLine={false}
                  axisLine={{ stroke: "var(--yaxis-tick-color)", strokeOpacity: 0.4 }}
                  tick={{ fontSize: xAxisFontSize, fill: "var(--yaxis-tick-color)" }}
                  orientation={xAxisOrientation}
                  interval={0}
                  angle={xAxisOrientation === "bottom" ? xAxisLayout.angle : 0}
                  textAnchor={xAxisOrientation === "bottom" && xAxisLayout.angle ? "end" : "middle"}
                  height={xAxisOrientation === "bottom" ? xAxisLayout.height : 30}
                  tickFormatter={truncateXLabel}
                />
                <YAxis hide tickFormatter={yAxisFormatter} domain={yDomain ?? [0, (dataMax: number) => dataMax * 1.12]} />
                <Tooltip
              content={(e) => CustomTooltip({...e, customTooltipFormatter})}
            />
                <Legend 
                  verticalAlign="top" 
                  align="center"
                  content={({ payload }) => <CustomLegend payload={payload} />}
                  iconSize={20}
                  // Largura fixa = a do gráfico: o Recharts centralizava a legenda com a
                  // medida de quando o gráfico ainda era largo e ela ficava cortada à direita.
                  wrapperStyle={{ left: 0, width: "100%" }}
                />
                {bars.map((bar: any, index: any) => (
                  <Bar key={index} dataKey={bar.dataKey} fill={colors[index]} name={bar.name} stackId={bar.stackId} radius={[2, 2, 0, 0]} maxBarSize={barMax} minPointSize={2} isAnimationActive={false}>
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
                          isStaticHighlighted: false,
                        })}
                      />
                    ))}
                  </Bar>
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
</div>
          </div>
        </div>
      </div>
    );
};

export default HorizontalScrollableBarChart;
