import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  LabelList
} from "recharts";

import { formatCategoryLabel, tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { useElementSize } from "./barThickness";
import { DATA_LABEL_STYLE, formatDataLabel } from "./biLabels";
import { resolveCrossFilterFill, useChartCrossFilter } from "./crossFilterFill";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";
import { resizeDiv } from "../features/resizeDiv";

const splitDataInBlocks = (data: any[], blockSize: number = 100) => {
  const blocks: any[][] = [];

  for (let i = 0; i < data.length; i += blockSize) {
    blocks.push(data.slice(i, i + blockSize));
  }

  return blocks;
};

const formatLabel = formatCategoryLabel;

// Espaço que eixo de valores + legenda ocupam no topo; altura mínima de cada
// linha (abaixo disso o rótulo encosta no vizinho) e espessura máxima da barra.
const AXIS_AND_LEGEND_H = 30;
const MIN_ROW_H = 22;
const MAX_BAR_THICKNESS = 20;

// Trunca em UMA linha com reticência — nomes longos não devem inflar a
// altura da categoria (isso empurrava as barras pra longe umas das outras).
// O nome completo continua disponível no tooltip ao passar o mouse.
const truncateLabel = (text: string, maxChars: number) => {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
};

const VerticalScrollableBarChart = ({
  data,
  title,
  xKey,
  bars,
  colors = [],
  heightPerCategory = 50,  
  visibleHeight = 400, 
  widthY = 100,
  left = -5,
  yFontSize = 12,
  highlightValues = ["Recife"],
  highlightColor,
  maxBarSize,
}: any) => {
  const chartId = useId();
  const { crossFilterActive, visibleData, select, emphasisOpacity } = useChartCrossFilter(
    chartId,
    data,
    (entry: any) => entry[xKey],
    title,
    { emphasis: true }
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [width, setWidth] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState("start");
  const [dataRead, setDataRead] = useState<any[]>([]);
  const [blocksCount, setBlocksCount] = useState(1);

  resizeDiv(containerRef, width, setWidth)

  // Altura da janela visível — no modo tela única (.bi-fit) ela vem do CSS
  // (--bi-chart-h), não da prop visibleHeight, então medimos de verdade.
  const [measureRef, boxSize] = useElementSize<HTMLDivElement>();
  const boxHeight = boxSize?.height || null;
  const setScrollRef = useCallback((el: HTMLDivElement | null) => {
    scrollRef.current = el;
    measureRef(el);
  }, [measureRef]);

  useEffect(() => {
    const blocks = splitDataInBlocks(visibleData);
    setDataRead(blocks[0] || []);
    setBlocksCount(1);
  }, [visibleData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      if (scrollTop === 0) {
        setScrollPosition("start");
      } else if (scrollTop + clientHeight >= scrollHeight) {
        setScrollPosition("end");

        setBlocksCount((prev) => {
          if (prev < splitDataInBlocks(visibleData).length) {
            setDataRead(visibleData.slice(0, (prev + 1) * 100));
            return prev + 1;
          }
          return prev;
        });
      } else {
        setScrollPosition("middle");
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [dataRead]); 

  // Eixo dos nomes: largura pedida pela prop, alargada até caber o rótulo mais
  // longo (no máximo 35% do gráfico) — com 100px fixos quase todo nome virava
  // "Guarulh…", "Rio De…".
  const longestLabel = dataRead.reduce((max: number, entry: any) => Math.max(max, formatLabel(String(entry[xKey])).length), 0);
  const effectiveWidthY = Math.round(
    Math.max(widthY, Math.min((width || 0) * 0.35, longestLabel * yFontSize * 0.62 + 24))
  );

  // Margem de segurança maior que a "largura média de caractere" ingênua —
  // rótulos com muitas maiúsculas largas (M, W, A) senão estouravam a
  // largura do eixo e ficavam cortados à esquerda (texto ancorado à direita).
  const charsPerLine = Math.max(6, Math.floor((effectiveWidthY - 30) / (yFontSize * 0.72)));

  // Gráfico completo: se todas as categorias cabem na janela visível (linhas de
  // pelo menos MIN_ROW_H), elas se distribuem pela altura toda — sem rolagem
  // nem barra cortada no rodapé. Só quando não cabem a janela rola, com linhas
  // de MIN_ROW_H. Barras finas: 60% da linha, no máximo MAX_BAR_THICKNESS.
  const plotHeight = boxHeight ? boxHeight - AXIS_AND_LEGEND_H : null;
  const fitsAll = plotHeight !== null && dataRead.length * MIN_ROW_H <= plotHeight;
  const effectiveHeightPerCategory = plotHeight === null
    ? heightPerCategory
    : fitsAll
      ? plotHeight / Math.max(1, dataRead.length)
      : MIN_ROW_H;
  const barThickness = Math.min(MAX_BAR_THICKNESS, Math.max(8, Math.round(effectiveHeightPerCategory * 0.6)));

  // -2: sem isso o arredondamento deixava 1px de rolagem "fantasma".
  const totalHeight = fitsAll
    ? boxHeight! - 2
    : Math.max(dataRead.length * effectiveHeightPerCategory + AXIS_AND_LEGEND_H, boxHeight ?? 300);

  const renderYAxisTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="end" fontSize={yFontSize} fill="var(--yaxis-tick-color)" dy={4}>
        {truncateLabel(formatLabel(String(payload.value)), charsPerLine)}
      </text>
    </g>
  );

  return (
    <div ref={containerRef} className="relative bg-transparent w-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center mb-4 font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
      </div>

      <div
        ref={setScrollRef}
        className="bi-bar-window overflow-y-auto overflow-x-visible"
        style={{ height: `${visibleHeight}px` }}
      >
        <div>
          <ResponsiveContainer width={(width || 0) - 5} height={totalHeight}>
            <RechartsBarChart
              data={dataRead}
              layout="vertical"
              // Estilo Power BI: valor escrito na ponta de cada barra (margem
              // direita pra ele), sem eixo de valores nem grade.
              margin={{ top: 6, right: 52, left: left, bottom: 5 }}
            >
              <XAxis type="number" hide tickFormatter={yAxisFormatter} domain={[(min: number) => Math.min(0, min), "auto"]} />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={renderYAxisTick}
                tickLine={false}
                axisLine={{ stroke: "var(--yaxis-tick-color)", strokeOpacity: 0.4 }}
                interval={0}
                width={effectiveWidthY}
              />
              <Tooltip content={(e) => CustomTooltip({ ...e, customTooltipFormatter: tooltipFormatter })} />

              <Legend 
                verticalAlign="top" 
                align="center"
                content={({ payload }) => (
                  <div className="flex justify-center ml-10 mt-2 w-[90%]">
                    <CustomLegend payload={payload} />
                  </div>
                )}
                iconSize={20}
              />

              {/* <Legend 
                verticalAlign="top" 
                align="center"
                content={({ payload }) => (
                    <div className="pl-5 mt-2 w-[100%]">
                      <CustomLegend payload={payload} />
                    </div>
                )}
                iconSize={20}
              />

              <Legend 
                verticalAlign="top" 
                align="center"
                content={({ payload }) => <CustomLegend payload={payload} />}
                iconSize={20}
              /> */}

              {bars.map((bar: any, index: number) => (
                <Bar key={index} dataKey={bar.dataKey} name={bar.name} fill={colors[0]} radius={[0, 2, 2, 0]} maxBarSize={Math.min(maxBarSize ?? Infinity, barThickness)} isAnimationActive={false}>
                  <LabelList dataKey={bar.dataKey} position="right" formatter={formatDataLabel} style={DATA_LABEL_STYLE} />
                  {dataRead.map((entry: any, dataIndex: number) => (
                    <Cell
                      key={`cell-${dataIndex}`}
                      cursor="pointer"
                      fillOpacity={emphasisOpacity(entry)}
                      onClick={() => select(chartId, String(entry[xKey]))}
                      fill={resolveCrossFilterFill({
                        crossFilterActive,
                        defaultFill: colors[index % colors.length],
                        isStaticHighlighted: highlightValues.some((v: string) => entry[xKey]?.includes(v)),
                        staticHighlightFill: highlightColor ?? colors[(index % colors.length) + 1],
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
  );
};

export default VerticalScrollableBarChart;
