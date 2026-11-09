"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import Diversidade from "./(diversidade)/diversidade";
import EmpregosEmpresas from "./(empregos-empresas)/empregos-empresas";
import EmpregosSetor from "./(empregos-setor)/empregos-setor";
import Movimentacao from "./(movimentacao)/movimentacao";
import NegociosCriativos from "./(negocios-criativos)/negocios-criativos";
import Perfil from "./(perfil)/perfil";
import RfcLocacoes from "./(rfc-locacoes)/rfc-locacoes";
import RfcPainel from "./(rfc-painel)/rfc-painel";
import RfcProducoes from "./(rfc-producoes)/rfc-producoes";
import Salarios from "./(salarios)/salarios";

// Abas alimentadas pelo mesmo economiaCriativaDataService (RAIS filtrada por CNAE, split
// ativ/noAtiv) — todas leem data?.economiaCriativa.
const RAIS_TABS = new Set(["perfil", "movimentacao", "diversidade", "empregos-setor", "empregos-empresas", "salarios"]);

const TABS: { tab: string; label: string }[] = [
  { tab: "perfil", label: "Perfil" },
  { tab: "movimentacao", label: "Movimentação" },
  { tab: "diversidade", label: "Diversidade" },
  { tab: "empregos-setor", label: "Empregos por Setor" },
  { tab: "empregos-empresas", label: "Empregos por Empresas" },
  { tab: "salarios", label: "Salários" },
  { tab: "negocios-criativos", label: "Negócios Criativos" },
  { tab: "rfc-producoes", label: "RFC Produções" },
  { tab: "rfc-locacoes", label: "RFC Locações" },
  { tab: "rfc-painel", label: "RFC Painel" },
];

const EconomiaCriativaPage = () => {
  const { isLoading, data, filters } = useDashboard() as any;
  const [activeTab, setActiveTab] = useState("perfil");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab("perfil");
      router.replace(`?tab=perfil`);
    }
  }, [searchParams, activeTab, router]);

  // Só as abas baseadas em RAIS precisam desse unwrap ativ/noAtiv — Negócios Criativos e as 3
  // abas RFC leem direto de data.empresasEconomiaCriativa / data.rfc, que já vêm como array plano
  // do respectivo service. Derivado direto de `data` via useMemo (não um efeito com
  // setInterval/setState polling, como o rais/page.tsx original fazia) — aquele padrão podia
  // "travar" em ativ: [] permanentemente: o efeito reagia a `data` mudando, e cada mudança
  // reiniciava um intervalo que, na primeira checagem (ainda com o `data` antigo/nulo no
  // closure), já gravava ativ:[] — se essa fosse a última execução antes do fetch real terminar,
  // nada disparava uma nova tentativa. Derivação reativa não tem essa janela de corrida.
  const economiaCriativa = useMemo(() => {
    if (!RAIS_TABS.has(activeTab)) return null;
    if (!data?.economiaCriativa) return null;

    return {
      ativ: data.economiaCriativa.ativ.filteredData,
      noAtiv: data.economiaCriativa.noAtiv.filteredData,
    };
  }, [data, activeTab]);

  if (isLoading) return <LoadingScreen />;

  const renderContent = () => {
    const year = getYearSelected(filters);

    switch (activeTab) {
      case "perfil":
        if (!economiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <Perfil data={economiaCriativa} year={year} />;
      case "movimentacao":
        if (!economiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <Movimentacao data={economiaCriativa} year={year} />;
      case "diversidade":
        if (!economiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <Diversidade data={economiaCriativa} year={year} />;
      case "empregos-setor":
        if (!economiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <EmpregosSetor data={economiaCriativa} year={year} />;
      case "empregos-empresas":
        if (!economiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <EmpregosEmpresas data={economiaCriativa} year={year} />;
      case "salarios":
        if (!economiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <Salarios data={economiaCriativa} year={year} />;
      case "negocios-criativos":
        if (!data?.empresasEconomiaCriativa) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <NegociosCriativos data={data.empresasEconomiaCriativa.filteredData} year={year} />;
      case "rfc-producoes":
        if (!data?.rfc) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <RfcProducoes data={data.rfc.filteredData} dataSemMes={data.rfc.filteredDataSemMes} year={year} />;
      case "rfc-locacoes":
        if (!data?.rfc) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <RfcLocacoes data={data.rfc.filteredData} dataSemMes={data.rfc.filteredDataSemMes} year={year} />;
      case "rfc-painel":
        if (!data?.rfc) return <div className="text-center text-gray-600">Construindo gráficos...</div>;
        return <RfcPainel data={data.rfc.filteredData} />;
      default:
        return null;
    }
  };

  const handleNavigation = (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Economia Criativa
      </h1>

      <div className="bi-tabs">
        {TABS.map(({ tab, label }) => (
          <button
            key={tab}
            onClick={() => handleNavigation(tab)}
            className={`bi-tab ${
              activeTab === tab
                ? "bi-tab-active"
                : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default EconomiaCriativaPage;
