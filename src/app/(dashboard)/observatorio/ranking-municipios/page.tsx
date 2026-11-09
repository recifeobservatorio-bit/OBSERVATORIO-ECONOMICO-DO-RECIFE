"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import Dimensao from "./(dimensao)/dimensao";
import Geral from "./(geral)/geral";
import Indicador from "./(indicador)/indicador";
import Pilar from "./(pilar)/pilar";

const RankingPage = () => {
  const searchParams = useSearchParams();
  const { isLoading, data, filters } = useDashboard() as any;
  const [ranking, setRanking] = useState([]);
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
    const intervalId = setInterval(() => {

      if (data) {
        const rankingData = data.geral || {};
        setRanking(rankingData.filteredData || []);
  
      }
    }, 50);
  
      return () => clearInterval(intervalId);
    }, [data]);

  if (isLoading) return <LoadingScreen />;

  const renderContent = () => {
    if (!data || !ranking) {
      return (
        <div className="text-center text-gray-600">Construindo gráficos...</div>
      );
    }


    switch (activeTab) {
      case "geral":
        return <Geral
            data={ranking || []}
            year={getYearSelected(filters)}
            rawData={data?.geral?.rawData || []}
          />
      case "dimensao":
        return <Dimensao
            data={ranking || []}
            year={getYearSelected(filters)}
            rawData={data?.dimensao?.rawData || []}
          />
      case "pilar":
        return <Pilar
            data={ranking || []}
            year={getYearSelected(filters)}
            rawData={data?.pilar?.rawData || []}
          />
        case "indicador":
          return <Indicador
              data={ranking || []}
              year={getYearSelected(filters)}
              rawData={data?.indicador?.rawData || []}
            />
      default:
        return <Geral
            data={ranking || []}
            year={getYearSelected(filters)}
            rawData={data?.geral.rawData}
          />
    }
  };

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Ranking Geral de Competitividade
      </h1>
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
          Resumo Geral
        </button>
        <button
          onClick={() => handleNavigation("dimensao")}
          className={`bi-tab ${
            activeTab === "dimensao"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Dimensão
        </button>
        <button
          onClick={() => handleNavigation("pilar")}
          className={`bi-tab ${
            activeTab === "pilar"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Pilar
        </button>
        <button
          onClick={() => handleNavigation("indicador")}
          className={`bi-tab ${
            activeTab === "indicador"
              ? "bi-tab-active"
              : ""
          }`}
        >
           Indicador 
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default RankingPage;
