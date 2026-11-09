"use client";

import React from "react";

// Card compacto estilo BI (Power BI): ícone + título à esquerda, métrica
// grande opcional à direita, gráfico no meio, fonte pequena no rodapé.
// Generalização do PanoramaCard original para uso em qualquer página do
// dashboard — usa `.chart-content-wrapper` (classe global compartilhada
// com as demais páginas) com overrides `!important` pra não depender da
// ordem do CSS.
const BiCard = ({
  title,
  subtitle,
  icon,
  metric,
  metricLabel,
  source,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  metric?: string;
  metricLabel?: string;
  source?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="chart-content-wrapper !items-stretch">
      <div className="flex items-center justify-between gap-2 -mx-3 mb-1 px-3 py-1.5 rounded-t-[5px] bg-[var(--bi-navy)] text-white">
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <span className="w-5 h-5 text-white flex-shrink-0">{icon}</span>
          )}
          <h3 className="font-semibold text-sm leading-tight text-white truncate">{title}</h3>
        </div>
        {metric && (
          <div className="text-right flex-shrink-0 leading-tight">
            {metricLabel && (
              <p className="text-[9px] text-white/80">{metricLabel}</p>
            )}
            <p className="text-sm font-bold text-white">{metric}</p>
          </div>
        )}
      </div>
      {subtitle && <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      <div className="chart-wrapper flex-1">{children}</div>
      {source && (
        <p className="text-[9px] text-gray-400 dark:text-gray-500 w-full text-left mt-1">{source}</p>
      )}
    </div>
  );
};

export default BiCard;
