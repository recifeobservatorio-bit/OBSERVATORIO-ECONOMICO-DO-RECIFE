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

const graficos = [
  PibPerCapitaNE,
  EmpresasPorGrupo,
  AeroportoMovimentacao,
  TaxaSelic,
  BalancaComercialMovimentacao,
  EmpregosMovimentacao,
  IpcaMensal,
  RankingCompetitividade,
];

const PanoramaPage = () => {
  return (
    <div className="p-6 min-h-screen mt-48">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10 tracking-wide dark:text-gray-200">
        Panorama Recife
      </h1>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {graficos.map((Component, index) => (
          <ErrorBoundary key={index}>
            <Component />
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
};

export default PanoramaPage;
