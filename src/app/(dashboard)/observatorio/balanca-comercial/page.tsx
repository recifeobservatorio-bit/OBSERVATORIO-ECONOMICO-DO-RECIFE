"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { BalancaGeralData } from "@/@types/observatorio/@data/balancaComercialData";
import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";
import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import Analitico from "./(analitico)/analitico";
import Geral from "./(geral)/geral";


/**
 * Page de Balança Comercial
 * Agora usando o mesmo estilo que "AeroportosPage",
 * pegando `data` e `isLoading` diretamente do contexto
 * e deixando só a lógica de tabs e renderização local.
 */
const BalancaComercialPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [balanca, setBalanca] = useState<BalancaHeaders[]>([]);
  const [balancaSemMes, setBalancaSemMes] = useState<BalancaHeaders[]>([]);
  const [balancaPast, setBalancaPast] = useState<BalancaHeaders[]>([]);

  const { isLoading, data, filters } = useDashboard();

  const [activeTab, setActiveTab] = useState("geral");

  useEffect(() => {
      const tab = searchParams.get("tab");
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      } else if (!tab) {
        setActiveTab('geral');
        router.replace(`?tab=geral`);
      }
    }, [searchParams, activeTab, router]);

    useEffect(() => {
          if (data?.id === "balanca") {
            const balancaData = data?.geral || {};
            setBalanca(balancaData?.filteredData || {});
            setBalancaSemMes(balancaData?.filteredDataSemMes || []);
            setBalancaPast(balancaData?.filteredDataPast || []);

          }

      }, [data]);

  // Conteúdo principal, dependendo da aba
  const renderContent = () => {
    // Se data ainda não estiver disponível,
    // podemos mostrar um pequeno aviso ou algo similar.
    if (!data || !balanca) {
      return <div className="text-center text-gray-600">Gerando gráficos...</div>;
    }

    switch (activeTab) {
      case "analitico":
      case "comparativo":
        return (
          <Analitico
            key={activeTab}
            data={balanca}
            year={getYearSelected(filters)}
            comparativo={activeTab === "comparativo"}
            dataPast={balancaPast}
          />
        );

      case "geral":
      default:
        return (
          <Geral
            data={balanca}
            dataSemMes={balancaSemMes}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        );
    }
  };

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  // Se estiver carregando, exibimos Carregando
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Balança Comercial
      </h1>

      {/* Abas na ordem e com os nomes do Power BI. */}
      <div className="bi-tabs">
        {[
          { key: "geral", label: "Balança Comercial" },
          { key: "analitico", label: "Balança Analítico" },
          { key: "comparativo", label: "Balança Analítico Comparativo" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleNavigation(t.key)}
            className={`bi-tab ${activeTab === t.key ? "bi-tab-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default BalancaComercialPage;
