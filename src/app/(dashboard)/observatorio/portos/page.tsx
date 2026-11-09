"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { PortoGeralData, PortoOperacaoData } from "@/@types/observatorio/@data/portoData";
import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import AenaPage from "./(aena)/aena";
import Comparativo from "./(comparativo)/comparativo";
import Operacao from "./(embarque)/operacao";
import Geral from "./(geral)/geral";


const defaultData: PortoGeralData = {
  atracacao: [],
  carga: [],
  coords: [[], []],
  dictionaries: {
    origem: [],
    destino: [],
    mercado: [],
  },
  rawData: {
    atracacao: [],
    carga: [],
  },
  id: "porto",
};

const PortosPage = () => {
  const searchParams = useSearchParams();
  const { isLoading, data, filters, setData } = useDashboard();
  const [porto, setPorto] = useState<PortoGeralData>(defaultData);
  const [activeTab, setActiveTab] = useState("geral");
  const router = useRouter();

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
      if (data && data.id === "porto" && "filteredData" in data.atracacao) {
        setPorto({
          ...data,
          atracacao: data?.atracacao?.filteredData,
        } as PortoGeralData);
        console.log(data)
      } else {
        setPorto(defaultData);
      }

    }, [data]);
  
    if (Object.keys(porto).length === 0) {
      setPorto(defaultData);
    }


    if (isLoading) return <LoadingScreen />;

  const renderContent = () => {
    if (!data) {
      return <div className="text-center text-gray-600">Gerando gráficos...</div>;
    }

    if (isLoading) {
      return <LoadingScreen />;
    }

    switch (activeTab) {
      case "geral":
        return <Geral data={porto} months={getMonths(filters, true)} />;
      case "operacao":
        return <Operacao data={porto as PortoGeralData & PortoOperacaoData[]} months={getMonths(filters)} year={getYearSelected(filters)} />;
      case "comparativo":
        return <Comparativo data={porto} year={getYearSelected(filters)} months={getMonths(filters)}   />;
      case "passageiro":
        return <AenaPage />;
      default:
        return <Geral data={porto} months={getMonths(filters, true)} />;
    }
};

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Movimentação dos Portos
      </h1>
      <div className="max-w-3xl mx-auto mb-3 px-4 py-3 rounded-lg border border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-200 text-center text-sm font-medium">
        Site da Antaq em manutenção. Último mês divulgado foi fevereiro/2026.
      </div>
      <div className="bi-tabs">
        {/* Botões de navegação */}
        <button
          onClick={() => handleNavigation("geral")}
          className={`bi-tab ${
            activeTab === "geral"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Geral
        </button>
        <button
          onClick={() => handleNavigation("operacao")}
          className={`bi-tab ${
            activeTab === "operacao"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Operação
        </button>
        <button
          onClick={() => handleNavigation("comparativo")}
          className={`bi-tab ${
            activeTab === "comparativo"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Comparativo
        </button>
        <button
          onClick={() => handleNavigation("passageiro")}
          className={`bi-tab ${
            activeTab === "passageiro"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Movimentação de Passageiros (Recife)
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default PortosPage;
