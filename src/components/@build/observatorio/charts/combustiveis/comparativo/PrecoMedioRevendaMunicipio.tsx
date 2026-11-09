"use client";

import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const PrecoMedioRevendaMunicipio = ({
  data,
  municipio,
  title,
  colors = ColorPalette.default,
}: any) => {
  const label = municipio || "Município";
  const chartData: any[] = data?.linhaComparativo ?? [];
  const xKey = "mes";

  // Mesma escala do Y usada no painel do Recife, pra dar pra comparar visualmente
  const recifeData = data?.linhaRecife ?? [];
  const allPrecos = [...chartData, ...recifeData].map((d: any) => d.preco).filter((v: number) => v != null);
  const yDomain = allPrecos.length
    ? [parseFloat((Math.min(...allPrecos) * 0.98).toFixed(2)), parseFloat((Math.max(...allPrecos) * 1.01).toFixed(2))]
    : undefined;

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        {chartData.length > 0 ? (
          <LineChart
            data={chartData}
            title={title ?? `Preço Médio de Revenda — ${label}`}
            colors={[colors[2]]}
            xKey={xKey}
            tooltipEntry="R$"
            yAxis={yDomain ? { domain: yDomain } : undefined}
            lines={[{ dataKey: "preco", name: `${label} (R$)`, strokeWidth: 2 }]}
          />
        ) : (
          <div className="bi-chart-box flex flex-col items-center justify-center text-gray-400 dark:text-gray-600" style={{ height: 400 }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mb-3 opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 16l4-4 4 4 4-8" />
            </svg>
            <p className="text-sm">Selecione um município no filtro para comparar</p>
          </div>
        )}
      </ChartGrabber>
    </div>
  );
};

export default PrecoMedioRevendaMunicipio;
