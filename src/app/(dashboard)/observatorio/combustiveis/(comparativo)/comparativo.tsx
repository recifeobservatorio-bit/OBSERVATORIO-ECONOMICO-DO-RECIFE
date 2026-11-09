"use client";

import React, { useRef, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import SelectPrincipal from "@/components/@global/features/SelectPrincipal";
import { CombustiveisIcon } from "@/components/@global/icons/sectionIcons";
import PrecoMedioProdutosMunicipio from "@/components/@build/observatorio/charts/combustiveis/comparativo/PrecoMedioProdutosMunicipio";
import PrecoMedioProdutosRecife from "@/components/@build/observatorio/charts/combustiveis/comparativo/PrecoMedioProdutosRecife";
import PrecoMedioRevendaMunicipio from "@/components/@build/observatorio/charts/combustiveis/comparativo/PrecoMedioRevendaMunicipio";
import PrecoMedioRevendaRecife from "@/components/@build/observatorio/charts/combustiveis/comparativo/PrecoMedioRevendaRecife";
import { useDashboard } from "@/context/DashboardContext";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import { municipioCards, recifeCards } from "./@imports/cards";

const Comparativo = ({ data, year, municipio }: { data: any; year?: string; municipio?: string }) => {
  const { filters, applyFilters } = useDashboard();

  // Mesmo seletor das outras abas de comparativo, mas ligado ao filtro MUNICÍPIO da
  // página (allowMultiple: false) — é ele que o service usa pra montar o lado esquerdo,
  // então escolher aqui ou no filtro do topo dá no mesmo e os dois ficam sincronizados.
  const municipioOptions =
    filters?.additionalFilters?.find((f) => f.label === "MUNICÍPIO")?.options ?? [];

  const selectMunicipio = (selected: string[]) => {
    applyFilters({
      ...filters,
      additionalFilters: filters.additionalFilters?.map((f) =>
        f.label === "MUNICÍPIO" ? { ...f, selected } : f
      ),
    });
  };

  return (
    <FitToScreen>
    <div className="pb-4">
      <SelectPrincipal
        options={municipioOptions}
        filters={municipio ? [municipio] : []}
        setFilters={selectMunicipio}
        unique
        label="Compare Municípios"
        placeholder="Digite para buscar um município"
        notFoundMessage="Nenhum município encontrado"
      />

      {/* Dois painéis lado a lado: município à esquerda, Recife à direita */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Painel Município comparado (esquerda) */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
            {municipio || "Selecione um município"}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {municipioCards.map(({ Component }, index) => (
              <React.Suspense fallback={<div className="min-w-[310px] h-[120px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />} key={index}>
                <ErrorBoundary>
                  <Component data={data} year={year} municipio={municipio} color={ColorPalette.default[index]} />
                </ErrorBoundary>
              </React.Suspense>
            ))}
          </div>

          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<CombustiveisIcon />} />
            <ErrorBoundary>
              <PrecoMedioRevendaMunicipio data={data} municipio={municipio} colors={ColorPalette.default} />
            </ErrorBoundary>
          </div>
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<CombustiveisIcon />} />
            <ErrorBoundary>
              <PrecoMedioProdutosMunicipio data={data} municipio={municipio} colors={ColorPalette.default} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Painel Recife (direita) */}
        <div className="flex flex-col gap-6">
          <p className="text-center text-sm font-semibold text-orange-600 dark:text-orange-400">Recife</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {recifeCards.map(({ Component }, index) => (
              <React.Suspense fallback={<div className="min-w-[310px] h-[120px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />} key={index}>
                <ErrorBoundary>
                  <Component data={data} year={year} color={ColorPalette.default[index]} />
                </ErrorBoundary>
              </React.Suspense>
            ))}
          </div>

          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<CombustiveisIcon />} />
            <ErrorBoundary>
              <PrecoMedioRevendaRecife data={data} colors={ColorPalette.default} />
            </ErrorBoundary>
          </div>
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<CombustiveisIcon />} />
            <ErrorBoundary>
              <PrecoMedioProdutosRecife data={data} colors={ColorPalette.default} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Comparativo;
