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
        return (
          <Analitico
            // Exemplo: se "data.geral?.filteredData" serve pro analítico também
            data={balanca}
            year={getYearSelected(filters)}
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

      {/* Botões de navegação de aba */}
      <div className="bi-tabs">
        <button
          onClick={() => handleNavigation("geral")}
          className={`bi-tab ${
            activeTab === "geral"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Balança Comercial
        </button>

        <button
          onClick={() => handleNavigation("analitico")}
          className={`bi-tab ${
            activeTab === "analitico"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Analítico
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default BalancaComercialPage;
