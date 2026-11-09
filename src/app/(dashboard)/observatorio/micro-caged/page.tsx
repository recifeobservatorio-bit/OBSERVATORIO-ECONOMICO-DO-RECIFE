"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";

import ComparativoMed from "./(comparativo-med)/comparativo-med";
import ComparativoMov from "./(comparativo-mov)/comparativo-mov";
import Media from "./(media)/media";
import Movimentacao from "./(movimentacao)/movimentacao";
import Salario from "./(salario)/salario";
import Saldo from "./(saldo)/saldo";

const MicroCagedPage = () => {
  const { isLoading, data, filters } = useDashboard() as any;
  const [microCaged, setMicroCaged] = useState<any>([]);
  const [microCagedSemMes, setMicroCagedSemMes] = useState<any>([]);
  const [microCagedMedia, setMicroCagedMedia] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("geral");

  const pathname = usePathname();
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

  useEffect(() => {
    const intervalId = setInterval(() => {
        
        if (data?.id === 'empregos-micro-caged' as 'porto') {
          const microCagedData = data?.microCaged || [];

          setMicroCaged(microCagedData.filteredData);
          setMicroCagedSemMes(microCagedData.filteredDataSemMes || []);

          clearInterval(intervalId);
        } else {
            setMicroCaged([]);
            setMicroCagedSemMes([]);
          }

        if (data?.id === 'empregos-micro-caged-media' as 'porto') {
          // const microCagedData = data?.microCaged || [];
          const microCagedMediaData = { current: data?.microCaged?.current?.filteredData || [], past: data?.microCaged?.past?.filteredData || [] };

          setMicroCagedMedia(microCagedMediaData);

          clearInterval(intervalId);
        } else {
            setMicroCagedMedia({ current: [], past: [] });
          }
      }, 50);
  
      return () => clearInterval(intervalId);
    }, [data, pathname]);
  
    if (isLoading) return <LoadingScreen />;

    
  const renderContent = () => {
    if (!data || !(microCaged?.length || microCagedMedia?.current?.length) ) {
      return <div className="text-center text-gray-600">Construindo gráficos...</div>;
    }

    switch (activeTab) {
      case "geral":
        return <Movimentacao
        data={microCaged} 
        year={getYearSelected(filters)} 
        />  
      case "saldo":
        return <Saldo
        data={microCaged} 
        year={getYearSelected(filters)} 
        /> 
      case "media":
        return <Media
        data={microCaged} 
        year={getYearSelected(filters)} 
        /> 
      case "comparativo-mov":
        return <ComparativoMov
        data={microCaged}
        dataSemMes={microCagedSemMes}
        year={getYearSelected(filters)}
        />
      case "comparativo-med":
        return <ComparativoMed
        data={microCagedMedia} 
        year={getYearSelected(filters)} 
        /> 
      case "salario":
        return <Salario
        data={microCaged} 
        year={getYearSelected(filters)} 
        /> 
      default:
        return <Movimentacao 
        data={microCaged} 
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
        Microdados (CAGED)
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
          Movimentações
        </button>
        <button
          onClick={() => handleNavigation("saldo")}
          className={`bi-tab ${
            activeTab === "saldo"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Saldo
        </button>
        <button
          onClick={() => handleNavigation("media")}
          className={`bi-tab ${
            activeTab === "media"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Salário Médio
        </button>
        <button
          onClick={() => handleNavigation("comparativo-mov")}
          className={`bi-tab ${
            activeTab === "comparativo-mov"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Movimentação Comparativo
        </button>
        <button
          onClick={() => handleNavigation("comparativo-med")}
          className={`bi-tab ${
            activeTab === "comparativo-med"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Salário Médio Comparativo
        </button>
        <button
          onClick={() => handleNavigation("salario")}
          className={`bi-tab ${
            activeTab === "salario"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Comparação CBO
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default MicroCagedPage;
