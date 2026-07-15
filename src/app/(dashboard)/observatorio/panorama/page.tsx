"use client";

import AeroportoMovimentacao from "@/components/@build/observatorio/panorama/AeroportoMovimentacao";
import BalancaComercialMovimentacao from "@/components/@build/observatorio/panorama/BalancaComercialMovimentacao";
import EmpregosMovimentacao from "@/components/@build/observatorio/panorama/EmpregosMovimentacao";
import EmpresasPorGrupo from "@/components/@build/observatorio/panorama/EmpresasPorGrupo";
import IpcaMensal from "@/components/@build/observatorio/panorama/IpcaMensal";
import PibPerCapitaNE from "@/components/@build/observatorio/panorama/PibPerCapitaNE";
import RankingCompetitividade from "@/components/@build/observatorio/panorama/RankingCompetitividade";
import TaxaSelic from "@/components/@build/observatorio/panorama/TaxaSelic";
import ErrorBoundary from "@/utils/loader/errorBoundary";

const linhaSuperior = [AeroportoMovimentacao, PibPerCapitaNE, EmpresasPorGrupo, TaxaSelic];
const linhaInferior = [BalancaComercialMovimentacao, EmpregosMovimentacao, IpcaMensal, RankingCompetitividade];

const PanoramaPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Panorama Recife</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {linhaSuperior.map((Component, index) => (
          <ErrorBoundary key={index}>
            <Component />
          </ErrorBoundary>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {linhaInferior.map((Component, index) => (
          <ErrorBoundary key={index}>
            <Component />
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
};

export default PanoramaPage;
