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
      case "desembarque":
        return <Embarque 
          key={activeTab}
          data={anac || []}
          toCompare={filters.additionalFilters[4]?.selected}
          fixedType={activeTab === "desembarque" ? "Desembarque" : "Embarque"}
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
        Aeroportos
      </h1>
      {/* Abas na ordem e com os nomes do Power BI. */}
      <div className="bi-tabs">
        {[
          { key: "geral", label: "Movimentação dos Aeroportos Geral" },
          { key: "embarque", label: "Movimentação dos Aeroportos Embarque" },
          { key: "desembarque", label: "Movimentação dos Aeroportos Desembarque" },
          { key: "comparativo", label: "Movimentação dos Aeroportos Comparativo" },
          { key: "aena", label: "Movimentação dos Aeroportos AENA" },
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

export default AeroportosPage;
