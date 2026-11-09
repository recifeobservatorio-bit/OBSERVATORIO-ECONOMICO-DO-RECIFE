"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";
import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import AenaPage from "./(aena)/aena";
import Comparativo from "./(comparativo)/comparativo";
import Embarque from "./(embarque)/embarque";
import Geral from "./(geral)/geral";


const AeroportosPage = () => {
  const searchParams = useSearchParams();
  const { isLoading, data, filters } = useDashboard();
  const [anac, setAnac] = useState<AnacGeralHeaders[]>([]);
  const [anacSemMes, setAnacSemMes] = useState<AnacGeralHeaders[]>([]);
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
          if (data?.id === "anac") {
            setAnac(data.geral?.filteredData || []);
            setAnacSemMes(data.geral?.filteredDataSemMes || []);
          }
          
          clearInterval(intervalId);
        }
      }, 50);
  
      return () => clearInterval(intervalId);
    }, [data]);
  
    if (isLoading) return <LoadingScreen />;

  const renderContent = () => {
    if (!data || !anac) {
      return <div className="text-center text-gray-600">Construindo gráficos...</div>;
    }

    switch (activeTab) {
      case "geral":
        return <Geral
          data={anac || []}
          dataSemMes={anacSemMes || []}
          rawData={data?.id === "anac" ? data.geral?.rawData || [] : []}
          year={getYearSelected(filters)}
          months={getMonths(filters)}
        />;
        //FAVOR, EDITAR ESTE TOCOMPARE PARA SER SETTADO COM BASE EM DATA PARA DEPOIS SÓ PRECISAR SETAR O FILTRO DA TAB COMO
        // DEFAULTFILTERS E CONSEGUIR PASSAR SOMENTE O ANO.
      case "comparativo":
        return <Comparativo
          data={anac || []}
          dataSemMes={anacSemMes || []}
          year={getYearSelected(filters)}
          months={getMonths(filters)}
        />;
      case "embarque":
        return <Embarque 
          data={anac || []}
          toCompare={filters.additionalFilters[4]?.selected}
        />;
      case "aena":
        return <AenaPage months={getMonths(filters)} year={getYearSelected(filters)} />;
      default:
        return <Geral
        data={anac || []}
        dataSemMes={anacSemMes || []}
        rawData={data?.id === "anac" ? data.geral?.rawData || [] : []}
        year={getYearSelected(filters)}
        months={getMonths(filters)}
        />;
    }
  };

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Movimentação de Aeroportos
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
          onClick={() => handleNavigation("embarque")}
          className={`bi-tab ${
            activeTab === "embarque"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Embarque/Desembarque
        </button>
        <button
          onClick={() => handleNavigation("aena")}
          className={`bi-tab ${
            activeTab === "aena"
              ? "bi-tab-active"
              : ""
          }`}
        >
          <i>AENA</i>
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default AeroportosPage;
