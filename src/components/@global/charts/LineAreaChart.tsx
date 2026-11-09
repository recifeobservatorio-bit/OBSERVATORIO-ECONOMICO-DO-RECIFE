import React, { useId } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { tooltipFormatter, yAxisFormatter } from "@/utils/formatters/@global/graphFormatter";

import { formatDataLabel } from "./biLabels";
import { useChartCrossFilter } from "./crossFilterFill";
import CustomLegend from "../features/CustomLegend";
import CustomTooltip from "../features/CustomTooltip";


const LineAreaChart = ({
  data,
  title,
  xKey,
  areaKeys,
  colors,
  tooltipEntry
}: any) => {
  const chartId = useId();
  const { visibleData, pickFilter } = useChartCrossFilter(chartId, data, (entry: any) => entry[xKey], title);

  // Clicar num ponto (mês, ano ou outra categoria do eixo X) escolhe esse valor no filtro da página.
  const handleChartClick = (state: any) => {
    if (state?.activeLabel == null || !state.activePayload?.length) return;
    pickFilter(String(state.activeLabel));
  };

  const gradientOffset = (dataKey: string) => {
    const dataMax = Math.max(...visibleData.map((i: any) => i[dataKey]));
    const dataMin = Math.min(...visibleData.map((i: any) => i[dataKey]));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  };

  const customTooltipFormatter = (value: any) => {
    return tooltipFormatter(value, tooltipEntry || "");
  };

  return (
    <div className="relative bg-transparent w-full h-full">
      <div className="flex flex-col items-center justify-center">
        <h3 className="bi-chart-title text-center font-semibold w-[90%] text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <div className="bi-chart-box" style={{ height: 400 }}>
<ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={visibleData}
          onClick={handleChartClick}
          style={{ cursor: "pointer" }}
          margin={{ top: 20, right: 20, left: 4, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "var(--yaxis-tick-color)" }} padding={{ left: 16, right: 16 }} minTickGap={10} />
          {/* Eixo Y partindo do 0 (abaixo dele só se houver valores negativos). */}
          <YAxis domain={[(dataMin: number) => Math.min(0, dataMin), "auto"]} tick={{ fontSize: 11, fill: "var(--yaxis-tick-color)" }} width={60} tickFormatter={(v: any) => (Math.abs(Number(v)) >= 1e4 ? formatDataLabel(v) : yAxisFormatter(v))} />
          <Tooltip
            content={(e) => CustomTooltip({...e, customTooltipFormatter})}
          />
          <Legend />
          {/* <Legend 
            verticalAlign="top" 
            align="center"
            content={({ payload }) => <CustomLegend payload={payload} />}
            iconSize={20}
          /> */}
          
          {areaKeys.map((key: any, index: any) => {
            const off = gradientOffset(key);
            const color = colors[index % colors.length];
            
            return (
                <React.Fragment key={key}>
                <defs>
                    <linearGradient id={`splitColor-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset={off} stopColor={color} stopOpacity={1} />
                      <stop offset={off} stopColor="red" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey={key}
                    stroke={color}
                    fill={`url(#splitColor-${key})`}
                    name={key}
                    isAnimationActive={false}
                />
                </React.Fragment>
            );
            })}
        </RechartsAreaChart>
      </ResponsiveContainer>
</div>
    </div>
  );
};

export default LineAreaChart;