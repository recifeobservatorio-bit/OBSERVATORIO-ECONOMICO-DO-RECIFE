import { useId, useMemo, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { DATA_LABEL_STYLE, formatDataLabel, keyPointIndexes } from "./biLabels";
import { useChartCrossFilter } from "./crossFilterFill";
import LineRangeBar from "./LineRangeBar";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";

const LineChart = ({
  data,
  title,
  underTitle,
  xKey,
  yAxis,
  lines,
  colors = [],
  tooltipEntry,
  height = 340,
  referenceLine,

}: any) => {
  const chartId = useId();
  const gradientId = `line-fill-${chartId.replace(/:/g, "")}`;
  const { visibleData: rawVisibleData, pickFilter } = useChartCrossFilter(chartId, data, (entry: any) => entry[xKey], title);

  // Corta do final da série os pontos sem dado real (nulo/undefined/0), ex:
  // meses futuros ainda não apurados — evita desenhar uma queda falsa até zero.
  const lineKeys = lines.map((line: any) => line.dataKey);
  let cutoff = rawVisibleData.length;
  for (let i = rawVisibleData.length - 1; i >= 0; i--) {
    const isEmpty = lineKeys.every((key: string) => {
      const value = rawVisibleData[i]?.[key];
      return value == null || value === 0;
    });
    if (isEmpty) cutoff = i;
    else break;
  }
  const visibleData = useMemo(() => rawVisibleData.slice(0, cutoff), [rawVisibleData, cutoff]);

  // Série longa (ex.: 5 anos mês a mês num card de 1/3 da tela): com traço
  // grosso, sem preenchimento e rótulos amontoados virava um "cardiograma".
  // Nela o traço afina e ganha uma área suave por baixo, que dá leitura de
  // tendência; séries curtas mantêm o traço de 3px e ganham bolinhas.
  const DENSE_POINTS = 24;
  const dense = visibleData.length > DENSE_POINTS;
  const sparse = visibleData.length <= 12;
  const filled = lines.length <= 2;
  const hasNegative = visibleData.some((d: any) => lineKeys.some((key: string) => Number(d?.[key]) < 0));

  // Série longa ganha uma barra deslizante (LineRangeBar) embaixo pra recortar
  // um trecho e ver de perto (60+ meses em ~390px parecem um eletrocardiograma).
  // Abre com o período todo (pedido do usuário); a janela volta ao período
  // todo quando a série muda de tamanho (troca de filtro).
  const defaultRange = { len: visibleData.length, start: 0, end: Math.max(0, visibleData.length - 1) };
  const [windowRange, setWindowRange] = useState(defaultRange);
  const range = windowRange.len === visibleData.length ? windowRange : defaultRange;
  const shownData = dense ? visibleData.slice(range.start, range.end + 1) : visibleData;

  // Estilo Power BI: com até 2 séries, além do eixo Y, o valor aparece
  // escrito nos pontos-chave (início, fim, máximo e mínimo) de cada linha.
  // Com 3+ séries os rótulos virariam ruído; aí fica só o eixo Y.
  // Abaixo de NARROW_W (ex.: 4 gráficos por linha) só máximo e último ganham
  // rótulo — o eixo Y já dá a escala e os 4 rótulos encavalavam na linha.
  const NARROW_W = 420;
  const [chartWidth, setChartWidth] = useState(0);
  // Duas séries longas: os rótulos das duas pontas se sobrepunham — fica o eixo Y.
  const labeled = lines.length === 1 || (lines.length === 2 && !dense);
  const compactLabels = chartWidth > 0 && chartWidth < NARROW_W;
  // Índices relativos ao trecho exibido (o LabelList numera só os pontos do gráfico).
  const keyIndexes: Set<number>[] = lines.map((line: any) => keyPointIndexes(shownData.map((d: any) => d?.[line.dataKey]), compactLabels));

  // Eixo Y sempre partindo do 0 (pedido do usuário, vale pra todos os gráficos
  // de linha — inclusive os que passam domínio próprio via yAxis.domain, cujo
  // piso é trocado por 0). Com valores negativos (ex.: saldo de empregos) o
  // piso desce abaixo de 0 pra linha não ser cortada. Eixos invertidos
  // (rankings: 1º no topo) ficam como estão — a base deles é a pior posição.
  // "auto" deixa o Recharts arredondar os ticks (0 / 2 mil / 4 mil...) —
  // com função no domínio saíam valores quebrados como 6.166 e -1.410.
  const customDomain = yAxis?.domain;
  const yDomain = yAxis?.reversed
    ? customDomain
    : [
        typeof customDomain?.[0] === "number" ? Math.min(0, customDomain[0]) : hasNegative ? "auto" : 0,
        customDomain?.[1] ?? "auto",
      ];

  // Eixo Y curto ("1 mi" em vez de "1.024.941") pra sobrar largura pro gráfico.
  const compactYAxis = (value: any) =>
    Math.abs(Number(value)) >= 1e4 ? formatDataLabel(value) : yAxisFormatter(value);

  const customTooltipFormatter = (value: any) => {
    return tooltipFormatter(value, tooltipEntry || "");
  };

  // Clicar num ponto (mês, ano ou outra categoria do eixo X) escolhe esse valor no filtro da página.
  const handleChartClick = (state: any) => {
    if (state?.activeLabel == null || !state.activePayload?.length) return;
    pickFilter(String(state.activeLabel));
  };

  return (
    <div className="relative bg-transparent w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
        <div className="mb-2">
          {underTitle}
        </div>
      </div>
      {/* Coluna: o gráfico ocupa o que sobra e a barra de período fica embaixo, dentro da mesma altura. */}
      <div className="bi-chart-box" style={{ height: height, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: "1 1 0", minHeight: 0 }}>
<ResponsiveContainer width="100%" height="100%" onResize={(w) => setChartWidth(w)}>
        <ComposedChart
          data={shownData}
          onClick={handleChartClick}
          style={{ cursor: "pointer" }}
          margin={{ top: 20, right: 24, left: 4, bottom: 10 }}
        >
          <defs>
            {lines.map((line: any, lineIndex: number) => (
              <linearGradient key={line.dataKey} id={`${gradientId}-${lineIndex}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[lineIndex] || "#000"} stopOpacity={lines.length === 1 ? 0.22 : 0.12} />
                <stop offset="100%" stopColor={colors[lineIndex] || "#000"} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "var(--yaxis-tick-color)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--yaxis-tick-color)", strokeOpacity: 0.4 }}
            // Folga nas pontas: a linha não vai de uma borda à outra e os
            // rótulos do 1º/último ponto não ficam cortados nem colados no eixo.
            padding={{ left: 16, right: 16 }}
            // Em cards estreitos o gap de 24px deixava só 2 meses no eixo.
            minTickGap={10}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--yaxis-tick-color)" }}
            tickFormatter={compactYAxis}
            tickLine={false}
            axisLine={false}
            tickCount={5}
            width={60}
            {...yAxis}
            domain={yDomain}
          />
          <Tooltip
            content={(e) => CustomTooltip({...e, payload: e.payload?.filter((entry: any) => entry.type !== "none" && entry.value != null), customTooltipFormatter})}
          />
          <Legend
            verticalAlign="top"
            align="center"
            // A área de preenchimento não entra na legenda (só as linhas).
            content={({ payload }) => <CustomLegend payload={payload?.filter((entry: any) => entry.type !== "none" && entry.payload?.legendType !== "none")} />}
            iconSize={20}
          />
          {hasNegative && <ReferenceLine y={0} stroke="var(--yaxis-tick-color)" strokeOpacity={0.5} />}
          {referenceLine && (
            <ReferenceLine
              y={referenceLine.value}
              stroke={referenceLine.color || "#f97316"}
              strokeDasharray="4 4"
              label={{
                value: referenceLine.label || `Média: ${tooltipFormatter(referenceLine.value)}`,
                position: "insideTopRight",
                fill: referenceLine.color || "#f97316",
                fontSize: 12,
              }}
            />
          )}
          {filled && lines.map((line: any, lineIndex: number) => !line.dashed && (
            <Area
              key={`area-${lineIndex}`}
              type={line.type || "monotone"}
              dataKey={line.dataKey}
              stroke="none"
              fill={`url(#${gradientId}-${lineIndex})`}
              baseValue={0}
              legendType="none"
              tooltipType="none"
              activeDot={false}
              connectNulls={line.connectNulls ?? true}
              isAnimationActive={false}
            />
          ))}
          {lines.map((line: any, lineIndex: any) => (
            <Line
              key={lineIndex}
              type={line.type || "monotone"}
              dataKey={line.dataKey}
              stroke={colors[lineIndex] || "#000"}
              strokeWidth={line.strokeWidth || (dense ? 2 : 3)}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={line.dashed ? "6 4" : undefined}
              dot={sparse ? { r: 3.5, strokeWidth: 2, stroke: colors[lineIndex] || "#000", fill: "#fff" } : false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              name={line.name}
              connectNulls={line.connectNulls ?? true}
              isAnimationActive={false}
            >
              {labeled && (
                <LabelList
                  dataKey={line.dataKey}
                  content={(props: any) => {
                    const { x, y, value, index } = props;
                    if (!keyIndexes[lineIndex]?.has(index) || value == null) return null;
                    return (
                      // 1º ponto alinhado à direita dele e último à esquerda: centralizados
                      // encostavam no eixo Y e na borda do card.
                      <text x={x} y={y - 8} textAnchor={index === 0 ? "start" : index === shownData.length - 1 ? "end" : "middle"} style={{ ...DATA_LABEL_STYLE, fill: colors[lineIndex] || DATA_LABEL_STYLE.fill }}>
                        {formatDataLabel(value)}
                      </text>
                    );
                  }}
                />
              )}
            </Line>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
      </div>
      {dense && (
        <LineRangeBar
          count={visibleData.length}
          start={range.start}
          end={range.end}
          series={lines.map((line: any) => visibleData.map((d: any) => d?.[line.dataKey]))}
          colors={colors}
          onChange={(start, end) => setWindowRange({ len: visibleData.length, start, end })}
          // Alinhada à área de plotagem: margem esquerda = eixo Y (60) + margem do gráfico (4) + padding do eixo X (16).
          style={{ margin: "2px 40px 4px 80px" }}
        />
      )}
</div>
    </div>
  );
};

export default LineChart;
