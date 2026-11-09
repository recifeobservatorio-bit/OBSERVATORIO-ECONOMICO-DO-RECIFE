"use client";

import { useState } from "react";

import AeroportoMovimentacao from "@/components/@build/observatorio/panorama/AeroportoMovimentacao";
import BalancaComercialMovimentacao from "@/components/@build/observatorio/panorama/BalancaComercialMovimentacao";
import EmpregosMovimentacao from "@/components/@build/observatorio/panorama/EmpregosMovimentacao";
import EmpresasPorGrupo from "@/components/@build/observatorio/panorama/EmpresasPorGrupo";
import IpcaMensal from "@/components/@build/observatorio/panorama/IpcaMensal";
import PanoramaFilters from "@/components/@build/observatorio/panorama/PanoramaFilters";
import TaxaSelic from "@/components/@build/observatorio/panorama/TaxaSelic";
import FitToScreen from "@/components/@global/features/FitToScreen";
import ErrorBoundary from "@/utils/loader/errorBoundary";

const PanoramaPage = () => {
  const [year, setYear] = useState("2025");

  return (
    <FitToScreen>
    <div className="bi-page">
      <h1 className="bi-page-title">
        Panorama Recife
      </h1>

      <PanoramaFilters year={year} onYearChange={setYear} />
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-2">
        O filtro afeta Empregos, Balança Comercial, Empresas e Aeroportos. IPCA e Taxa Selic mostram a série histórica completa.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <ErrorBoundary>
          <IpcaMensal />
        </ErrorBoundary>
        <ErrorBoundary>
          <TaxaSelic />
        </ErrorBoundary>
        <ErrorBoundary>
          <EmpregosMovimentacao year={year} />
        </ErrorBoundary>
        <ErrorBoundary>
          <EmpresasPorGrupo year={year} />
        </ErrorBoundary>
        <ErrorBoundary>
          <BalancaComercialMovimentacao year={year} />
        </ErrorBoundary>
        <ErrorBoundary>
          <AeroportoMovimentacao year={year} />
        </ErrorBoundary>
      </div>
    </div>
    </FitToScreen>
  );
};

export default PanoramaPage;
