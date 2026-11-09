"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import Demografia from "./(demografia)/demografia";
import Desligamento from "./(desligamento)/desligamento";
import Diversidade from "./(diversidade)/diversidade";
import Estoque from "./(estoque)/estoque";
import Grupo from "./(grupo)/grupo";
import Remuneracao from "./(remuneracao)/remuneracao";


const RaisPage = () => {
  const { isLoading, data, filters } = useDashboard() as any;
  const [activeTab, setActiveTab] = useState("geral");

  const searchParams = useSearchParams();
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

  // Derivado direto de `data` via useMemo, não um efeito com setInterval/setState polling (ver
  // mesmo fix em economia-criativa/page.tsx) — aquele padrão podia travar em ativ: [] pra sempre.
  const rais = useMemo(() => {
    if (!data?.rais) return null;

    return {
      ativ: data.rais.ativ.filteredData,
      noAtiv: data.rais.noAtiv.filteredData,
    };
  }, [data]);

  if (isLoading) return <LoadingScreen />;

  const renderContent = () => {
    if (!rais) {
      return <div className="text-center text-gray-600">Construindo gráficos...</div>;
    }

    switch (activeTab) {
      case "geral":
        return <Demografia
        data={rais} 
        year={getYearSelected(filters)} 
        />  
      case "desligamento":
        return <Desligamento 
        data={rais} 
        year={getYearSelected(filters)} 
        />
      case "diversidade":
        return <Diversidade 
        data={rais} 
        year={getYearSelected(filters)} 
        />
      case "grupo":
        return <Grupo 
        data={rais} 
        year={getYearSelected(filters)} 
        />
      case "estoque":
        return <Estoque 
        data={rais} 
        year={getYearSelected(filters)} 
        />
      case "remuneracao":
        return <Remuneracao 
        data={rais} 
        year={getYearSelected(filters)} 
        />
      default:
        return <Demografia 
        data={rais} 
        year={getYearSelected(filters)} 
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
        RAIS
      </h1>

      <div className="bi-tabs">
      <Link
          href={'empregos?tab=geral'}
          className={`bi-tab flex items-center justify-center ${
            activeTab === "caged"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Caged
        </Link>
        <button
          onClick={() => handleNavigation("geral")}
          className={`bi-tab ${
            activeTab === "geral"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Demográfia
        </button>
        <button
          onClick={() => handleNavigation("desligamento")}
          className={`bi-tab ${
            activeTab === "desligamento"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Desligamento
        </button>
        <button
          onClick={() => handleNavigation("diversidade")}
          className={`bi-tab ${
            activeTab === "diversidade"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Diversidade
        </button>
        <button
          onClick={() => handleNavigation("grupo")}
          className={`bi-tab ${
            activeTab === "grupo"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Grupos
        </button>
        <button
          onClick={() => handleNavigation("estoque")}
          className={`bi-tab ${
            activeTab === "estoque"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Estoque por empresas
        </button>
        <button
          onClick={() => handleNavigation("remuneracao")}
          className={`bi-tab ${
            activeTab === "remuneracao"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Relatório de remuneração
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default RaisPage;
