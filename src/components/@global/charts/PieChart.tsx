import { useId, ReactNode } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Text,
  Legend,
} from "recharts";

import { tooltipFormatter } from "@/utils/formatters/@global/graphFormatter";

import BarChart from "./BarChart";
import { resolveCrossFilterFill, useChartCrossFilter } from "./crossFilterFill";
import VerticalScrollableBarChart from "./VerticalScrollableBarChart";
// import CustomLegend from "../features/CustomLegends";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";

const PieSlices = ({
  data,
  title,
  underTitle,
  dataKey,
  nameKey,
  colors = [],
  tooltipEntry,
  showPercentages = true,
  highlightValues = [],
  highlightColor,
}: {
  data: any;
  title: string;
  underTitle?: ReactNode;
  dataKey: string;
  nameKey: string;
  colors: string[];
  showPercentages: boolean;
  tooltipEntry: string;
  highlightValues?: string[];
  highlightColor?: string;
}) => {
  const chartId = useId();
  const { crossFilterActive, visibleData, select, emphasisOpacity } = useChartCrossFilter(
    chartId,
    data,
    (entry: any) => entry[nameKey],
    title,
    { emphasis: true }
  );
  // Raio relativo ao espaço do gráfico (já sem a legenda): acompanha a altura
  // que a tela única dá a cada card, em vez de um raio fixo por largura da janela.
  const outerRadius = "80%";

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <Text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm pointer-events-none"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </Text>
    );
  };

  const customTooltipFormatter = (value: any) => {
      return tooltipFormatter(value, tooltipEntry || "");
  };

  return (
    <div className="relative bg-transparent w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center mb-4 font-semibold w-[90%] text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="mb-2">
        {underTitle}
        </div>
      </div>

      <div className="bi-chart-box" style={{ height: 350 }}>
<ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={visibleData}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            label={showPercentages ? renderCustomizedLabel : undefined}
            labelLine={false}
            isAnimationActive={false}
          >
            {visibleData.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                cursor="pointer"
                fillOpacity={emphasisOpacity(entry)}
                onClick={() => select(chartId, String(entry[nameKey]))}
                fill={resolveCrossFilterFill({
                  crossFilterActive,
                  defaultFill: colors[index % colors.length],
                  isStaticHighlighted: highlightValues.some((v: string) => entry[nameKey]?.includes(v)),
                  staticHighlightFill: highlightColor,
                })}
              />
            ))}
          </Pie>
          <Tooltip
              content={(e) => CustomTooltip({...e, customTooltipFormatter})}
            />
            <Legend 
                  verticalAlign="top" 
                  align="center"
                  content={({ payload }) => <CustomLegend payload={payload} noBorder />}
                  iconSize={20}
                />
        </RechartsPieChart>
      </ResponsiveContainer>
</div>
      {/* <CustomLegend
        dataSetter={data}
        colors={colors}
        nameKey={nameKey}
      /> */}
    </div>
  );
};

// Pizza só com até 3 fatias — com mais que isso fica difícil comparar os
// pedaços, então o mesmo gráfico vira colunas (poucos itens, nomes curtos) ou
// barras deitadas (muitos itens ou nomes longos). Conta pelos dados originais,
// não pelos já filtrados por clique, pra o tipo não trocar ao selecionar.
export const MAX_PIE_SLICES = 3;
const MAX_COLUMNS = 7;
const MAX_COLUMN_LABEL = 14;

const PieChart = (props: Parameters<typeof PieSlices>[0]) => {
  const { data, title, dataKey, nameKey, colors = [], tooltipEntry, highlightValues = [], highlightColor } = props;
  const rows: any[] = Array.isArray(data) ? data : [];
  if (rows.length <= MAX_PIE_SLICES) return <PieSlices {...props} />;

  const bars = [{ dataKey, name: title }];
  const longestLabel = rows.reduce((max, r) => Math.max(max, String(r?.[nameKey] ?? "").length), 0);
  if (rows.length <= MAX_COLUMNS && longestLabel <= MAX_COLUMN_LABEL) {
    return (
      <BarChart data={rows} title={title} colors={[colors[0]]} xKey={nameKey} bars={bars}
        tooltipEntry={tooltipEntry} highlightValues={highlightValues} highlightColor={highlightColor} />
    );
  }
  return (
    <VerticalScrollableBarChart data={rows} title={title} colors={[colors[0]]} xKey={nameKey} bars={bars}
      highlightValues={highlightValues} highlightColor={highlightColor} />
  );
};

export default PieChart;
