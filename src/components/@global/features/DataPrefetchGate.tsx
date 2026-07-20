"use client";

import { useEffect } from "react";

import { AeroportoData } from "@/@api/http/to-charts/aeroporto/AeroportoData";
import { BalancaComercialData } from "@/@api/http/to-charts/bal_comercial/BalancaComercialData";
import { fetchCapagRaw } from "@/@api/http/to-charts/capag/CapagData";
import { fetchCombustiveisRaw } from "@/@api/http/to-charts/combustiveis/CombustiveisData";
import { EmpregosData } from "@/@api/http/to-charts/empregos/EmpregosData";
import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import { IpcaData } from "@/@api/http/to-charts/ipca/IPCAData";
import { PibData } from "@/@api/http/to-charts/pib/PibData";
import { PortoData } from "@/@api/http/to-charts/porto/PortoData";
import { RaisData } from "@/@api/http/to-charts/rais/RaisData";
import { RankingData } from "@/@api/http/to-charts/ranking/RankingData";
import { SelicData } from "@/@api/http/to-charts/selic/SelicData";
import { fetchItbiRaw } from "@/@api/http/to-charts/tributos/ItbiData";
import { fetchIptuAmostra, fetchIptuResumo } from "@/@api/http/to-charts/tributos/IptuData";

const YEAR = "2024";

function buildWarmers(): Array<() => Promise<unknown>> {
  const aeroporto = new AeroportoData(YEAR);
  const empregos = new EmpregosData(YEAR);
  const empresas = new EmpresasData(YEAR);
  const ipca = new IpcaData(YEAR);
  const porto = new PortoData(YEAR);
  const ranking = new RankingData(YEAR);

  return [
    () => aeroporto.fetchProcessedData(),
    () => aeroporto.fetchProcessedAenaPassageirosData(),
    () => aeroporto.fetchProcessedAenaCargasData(),
    () => new BalancaComercialData(YEAR).fetchProcessedData(),
    () => fetchCapagRaw(),
    () => fetchCombustiveisRaw(),
    () => empregos.fetchProcessedDataCaged(),
    () => empregos.fetchProcessedDataCagedDesemprego(),
    () => empresas.fetchProcessedEmpresasAtivasRecife(),
    () => empresas.fetchProcessedEmpresasAtivas(),
    () => empresas.fetchProcessedEmpresasInativas(),
    () => empresas.fetchProcessedNaturezas(),
    () => empresas.fetchProcessedClasses(),
    () => empresas.fetchProcessedEmpresasAbertas(),
    () => empresas.fetchProcessedAbertasPorSecao(),
    () => empresas.fetchProcessedEmpresasFechadas(),
    () => empresas.fetchProcessedTempoMedio(),
    () => ipca.fetchProcessedGeralData(),
    () => ipca.fetchProcessedGruposData(),
    () => ipca.fetchProcessedTabelasData(),
    // MicroCaged (micro_caged.parquet) is deliberately excluded from the eager prefetch: it now
    // covers 9 municípios (~9.4M rows, 83MB) and parsing it client-side blocks the main thread for
    // several minutes — fine to eat that cost once on the Microdados (CAGED) page itself, but not
    // acceptable on every page load app-wide.
    () => new PibData(YEAR).fetchProcessedData(),
    () => porto.fetchAtracacaoPorAno(),
    () => porto.fetchCargaPorAno(),
    () => porto.fetchPassageirosPorAno(),
    () => new RaisData(YEAR).fetchProcessedDataRais(),
    () => ranking.fetchProcessedGeralData(),
    () => ranking.fetchProcessedDimensaoData(),
    () => ranking.fetchProcessedIndicadorData(),
    () => ranking.fetchProcessedPilaresData(),
    () => new SelicData().fetchProcessedData(),
    () => fetchItbiRaw(),
    () => fetchIptuResumo(),
    () => fetchIptuAmostra(),
  ];
}

// Warms each dataset's module-level cache in the background so navigating into a page finds its
// data already fetched — but never blocks first paint on it. It used to gate `children` behind a
// full-screen loader until every warmer settled (or a 45s safety timeout), which made opening the
// site take as long as the slowest of ~30 parquet fetches even when the user just wanted the
// homepage. Each page already has its own loading UI (GraphSkeleton, LoadingScreen, etc.), so
// there's nothing that actually needs the cache pre-warmed before rendering.
const DataPrefetchGate = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    buildWarmers().forEach((warm) => {
      warm().catch(() => {});
    });
  }, []);

  return <>{children}</>;
};

export default DataPrefetchGate;
