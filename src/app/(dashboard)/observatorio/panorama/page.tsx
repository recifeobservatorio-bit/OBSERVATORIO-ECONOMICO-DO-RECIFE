"use client";

import { useState } from "react";

import AeroportoMovimentacao from "@/components/@build/observatorio/panorama/AeroportoMovimentacao";
import BalancaComercialMovimentacao from "@/components/@build/observatorio/panorama/BalancaComercialMovimentacao";
import EmpregosMovimentacao from "@/components/@build/observatorio/panorama/EmpregosMovimentacao";
import EmpresasPorGrupo from "@/components/@build/observatorio/panorama/EmpresasPorGrupo";
import IpcaMensal from "@/components/@build/observatorio/panorama/IpcaMensal";
import PanoramaFilters from "@/components/@build/observatorio/panorama/PanoramaFilters";
import TaxaSelic from "@/components/@build/observatorio/panorama/TaxaSelic";
import ErrorBoundary from "@/utils/loader/errorBoundary";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-2">
    {children}
  </h2>
);

const PanoramaPage = () => {
  const [year, setYear] = useState("2025");

  return (
    <div className="p-6 min-h-screen mt-48">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6 tracking-wide dark:text-gray-200">
        Panorama Recife
      </h1>

      <PanoramaFilters year={year} onYearChange={setYear} />
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 -mt-6 mb-10">
        O filtro afeta Empregos, Balança Comercial, Empresas e Aeroportos. IPCA e Taxa Selic mostram a série histórica completa.
      </p>

      <div className="max-w-[1600px] mx-auto">
        <SectionTitle>Indicadores Econômicos</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ErrorBoundary>
            <IpcaMensal />
          </ErrorBoundary>
          <ErrorBoundary>
            <TaxaSelic />
          </ErrorBoundary>
        </div>

        <SectionTitle>Mercado de Trabalho e Empresas</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ErrorBoundary>
            <EmpregosMovimentacao year={year} />
          </ErrorBoundary>
          <ErrorBoundary>
            <EmpresasPorGrupo year={year} />
          </ErrorBoundary>
        </div>

        <SectionTitle>Comércio Exterior e Transporte</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ErrorBoundary>
            <BalancaComercialMovimentacao year={year} />
          </ErrorBoundary>
          <ErrorBoundary>
            <AeroportoMovimentacao year={year} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default PanoramaPage;
