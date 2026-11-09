import { useState, useEffect, useId } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { formatCategoryLabel, tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { resolveCrossFilterFill, useChartCrossFilter } from "./crossFilterFill";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";

const StackerBarChartVertical = ({
  data,
  title,
  xKey,
  bars,
  colors = [],
  heightPerCategory = 50,
  visibleHeight = 300,
  tooltipEntry,
  left = -35,
  yFontSize = 12,
  maxDescriptionLength,
  tooltipTitleFontSize,
  widthY = 150,
  showPercentage = true,
  minPercentageLabelWidth = 37, // mínimo % visual da barra para exibir label <- ajeitar isso aqui
  barSize,
  maxCategories = 50,
}: any) => {
  const chartId = useId();
  const { crossFilterActive, visibleData, select, emphasisOpacity } = useChartCrossFilter(
    chartId,
    data,
    (entry: any) => entry[xKey],
    title,
    { emphasis: true }
  );
  const rowTotal = (entry: any) =>
    bars.reduce((sum: number, bar: any) => sum + (Number(entry[bar.dataKey]) || 0), 0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Altura proporcional ao número de categorias — um piso fixo de 400px
  // pra poucas categorias deixava as barras esticadas/espalhadas.
  // Só as MAX_CATEGORIES maiores categorias são desenhadas: Balança ›
  // Produtos tinha ~670 linhas (SVG de 40.000px) — cada redimensionamento
  // redesenhava tudo, demorava e o ajuste de tela única entrava em loop. As
  // porcentagens continuam sobre o total de todas as categorias.
  const chartData = [...visibleData]
    .sort((a: any, b: any) => rowTotal(b) - rowTotal(a))
    .slice(0, maxCategories);

  const totalHeight = Math.max(chartData.length * heightPerCategory, 150);

  const customTooltipFormatter = (value: any) => tooltipFormatter(value, tooltipEntry || "");

  // Trunca em UMA linha com reticência com base na largura real do eixo —
  // um limite fixo de caracteres (ex.: 50) ficava largo demais pra um eixo
  // de ~150px e o texto acabava invadindo a área do gráfico.
  // Margem de segurança maior que a "largura média de caractere" ingênua —
  // rótulos com muitas maiúsculas largas (M, W, A) senão estouravam a
  // largura do eixo e ficavam cortados à esquerda (texto ancorado à direita).
  const effectiveMaxLen = maxDescriptionLength ?? Math.max(6, Math.floor((widthY - 30) / (yFontSize * 0.72)));
  const truncateForYAxis = (value: string) => {
    const formatted = formatCategoryLabel(value);
    return formatted.length > effectiveMaxLen ? `${formatted.slice(0, Math.max(1, effectiveMaxLen - 1)).trimEnd()}…` : formatted;
  };

  // Renderer customizado em vez de tick+tickFormatter: o tick padrão do
  // Recharts quebra o texto em várias linhas quando ele não cabe na
  // largura do eixo, mesmo já vindo truncado — isso garante UMA linha só.
  const renderYAxisTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="end" fontSize={yFontSize} fill="var(--yaxis-tick-color)" dy={4}>
        {truncateForYAxis(String(payload.value))}
      </text>
    </g>
  );

  // Mapeia totais por linha para cálculo de porcentagem
  const totalGlobal = visibleData.reduce((total: number, entry: any) => {
    return (
      total +
      bars.reduce((sum: number, bar: any) => sum + (Number(entry[bar.dataKey]) || 0), 0)
    );
  }, 0);

  return (
    <div className="relative bg-transparent w-full">
      {title &&       <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center mb-[2em] font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
      </div>}

      <div
        className="bi-bar-window overflow-y-auto overflow-x-visible"
        style={{ height: `${isSmallScreen ? 600 : visibleHeight}px` }}
      >
        {/* Conteúdo rolável: mantém a altura de todas as categorias (não é
            .bi-chart-box, que a tela única encolheria). */}
        <div style={{ height: totalHeight }}>
<ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 7, left, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              tickFormatter={yAxisFormatter} 
              tick={{ fontSize: 12, fill: "var(--yaxis-tick-color)" }} 
              orientation="top" 
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={renderYAxisTick}
              interval={0}
              width={widthY}
            />
            <Tooltip
              content={(e) => CustomTooltip({ ...e, customTooltipFormatter, fontSize: tooltipTitleFontSize })}
            />
            <Legend
              verticalAlign="top"
              align="center"
              iconSize={20}
              content={({ payload }) => (
                <div className="flex justify-center ml-10 mt-2 w-[90%]">
                  <CustomLegend payload={payload} />
                </div>
              )}
            />
            {bars.map((bar: any, barIndex: number) => (
              <Bar
                key={barIndex}
                dataKey={bar.dataKey}
                name={bar.name}
                stackId="stack"
                fill={colors[barIndex % colors.length]}
                // Barras finas (60% da linha), como nos demais gráficos de barra.
                barSize={barSize ?? Math.max(8, Math.round(heightPerCategory * 0.6))}
                isAnimationActive={false}
              >
                {chartData.map((entry: any, dataIndex: number) => (
                  <Cell
                    key={`cell-${dataIndex}`}
                    cursor="pointer"
                    fillOpacity={emphasisOpacity(entry)}
                    onClick={() => select(chartId, String(entry[xKey]))}
                    fill={resolveCrossFilterFill({
                      crossFilterActive,
                      defaultFill: colors[barIndex % colors.length],
                      isStaticHighlighted: entry[xKey] === "Recife",
                      staticHighlightFill: colors[(barIndex % colors.length) + 1],
                    })}
                  />
                ))}

                {bar.showPercentage && showPercentage && (
                  <LabelList
                  content={({ x = 0 as number, y = 0 as any, width = 0 as any, height = 0 as any, index }) => {
                    const entry = chartData[index!];
                    const valor = Number(entry[bar.dataKey]) || 0;
                    const percentual = totalGlobal ? (valor / totalGlobal) * 100 : 0;
                
                    if (percentual.toFixed(2) === "0.00") return null;
                
                    const isInside = width >= minPercentageLabelWidth;
                    const barColor = colors[barIndex % colors.length];
                    const anchor = isInside ? "end" : "start";
                
                    const val1 = Number(entry[bars[0].dataKey]) || 0;
                    const val2 = bars[1] ? Number(entry[bars[1].dataKey]) || 0 : 0;
                    const totalStack = val1 + val2;
                
                    const stackPixelWidth = totalStack > 0 ? (1 / (valor / totalStack)) * width : width;
                
                    const width1 = totalStack > 0 ? (val1 / totalStack) * width : 0;
                    const width2 = totalStack > 0 ? (val2 / totalStack) * width : 0;
                    const primeiraFora = width1 < minPercentageLabelWidth;
                    const segundaFora = width2 < minPercentageLabelWidth;
                
                    let posX: number;

                    if (isInside) {
                      posX = x + width - 2;
                    } else {
                      posX = x + stackPixelWidth + 10;

                      if (barIndex === 1 && primeiraFora && segundaFora && val1 !== 0) {
                        posX += 45 - stackPixelWidth;

                      } else if (barIndex === 1 && segundaFora && val1 !== 0){
                        posX = x + stackPixelWidth - 25;
                      }

                    }
                
                    return (
                      <text
                        x={posX}
                        y={y + height / 2}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fill={isInside ? "#fff" : barColor}
                        fontSize={12}
                        fontWeight={600}
                      >
                        {`${percentual.toFixed(2)}%`}
                      </text>
                    );
                  }}
                />
                
                
                
                
                )}
              </Bar>
            ))}

          </RechartsBarChart>
        </ResponsiveContainer>
</div>
      </div>
    </div>
  );
};

export default StackerBarChartVertical;
