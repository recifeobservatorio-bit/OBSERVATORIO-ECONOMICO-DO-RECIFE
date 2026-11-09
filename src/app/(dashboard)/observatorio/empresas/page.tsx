"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useDashboard } from "@/context/DashboardContext";
import { getYearSelected } from "@/utils/filters/@global/getYearSelected";


import ComparativoMed from "./(comparativo-med)/comparativo-med";
import EmpresasAtivas from "./(empresas-ativas)/empresas-ativas";
import EmpresasInativas from "./(empresas-inativas)/empresas-inativas";
import Salario from "./(salario)/salario";
import EmpresasAtivasInativas from "./(empresas-ativas-inativas)/empresas-ativas-inativas";
import EmpresasNaturezas from "./(empresas-naturezas)/empresas-naturezas";
import EmpresasClasses from "./(empresas-classes)/empresas-classes";
import ComparativoClasses from "./(comparativo-classes)/comparativo-classes";
import EmpresasAbertasFechadas from "./(empresas-abertas-fechadas)/empresas-abertas-fechadas";
import EmpresasTempoAbertura from "./(empresas-tempo-abertura)/empresas-tempo-abertura";

const EmpresasPage = () => {
  const { isLoading, data, filters } = useDashboard() as any;
  const [dataArr, setDataArr] = useState<any>([]);
  const [dataArrSemMes, setDataArrSemMes] = useState<any>([]);
  const [dataArrSemMesPast, setDataArrSemMesPast] = useState<any>([]);
  const [dataObjRawData, setDataObjRawData] = useState<any>({});
  const [dataObj, setDataObj] = useState<any>({});
  const [dataTest, setDataTest] = useState<any>({});
  const [dataTestTwo, setDataTestTwo] = useState<any>({});
  const [activeTab, setActiveTab] = useState("empresas-ativas");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
      const tab = searchParams.get("tab");
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      } else if (!tab) {
        setActiveTab('empresas-ativas');
        router.replace(`?tab=empresas-ativas`);
      }
    }, [searchParams, activeTab, router]);

  useEffect(() => {
    const intervalId = setInterval(() => {
        const idArrays = ["empresas-empresas-ativas-recife", "empresas-empresas-ativas", "empresas-empresas-inativas"]
        const idObjsRawData = ["empresas-empresas-naturezas", "empresas-empresas-classes"]
        const idObjs = ['empresas-empresas-ativas-inativas',  ]      
        const idTest = ["empresas-empresas-abertas-fechadas"]
        const idTest2 = ["empresas-empresas-tempo-abertura"]

        if (idArrays.includes(data?.id)) {
          // aqui vai para de ser somente arrays { empresas: [], rawData: [] }

          const empresasDataObj = data?.empresas || [];

          setDataArr(empresasDataObj.filteredData);
          setDataArrSemMes(empresasDataObj.filteredDataSemMes || []);
          setDataArrSemMesPast(empresasDataObj.filteredDataSemMesPast || []);

          clearInterval(intervalId);
        } else {
            setDataArr([]);
            setDataArrSemMes([]);
            setDataArrSemMesPast([]);
          }
        
        if (idTest.includes(data?.id)) {
          const empresasDataObj = { 
            empresas: { ativas: data?.empresas?.ativas?.filteredData || [], inativas: data?.empresas?.inativas?.filteredData || []}, 
            rawData: { ativas: data?.rawData?.ativas || [], inativas: data?.rawData?.inativas || [] }
          };

          setDataTest(empresasDataObj);

          clearInterval(intervalId);
        } else {
            setDataTest({ empresas: { ativas: [], inativas: []}, rawData: [] });
          }

        if (idTest2.includes(data?.id)) {
          const empresasDataObj = { 
            empresas: data?.empresas?.filteredData || [], 
            rawData: data?.rawData || []
          };

          setDataTestTwo(empresasDataObj);

          clearInterval(intervalId);
        } else {
            setDataTestTwo({ empresas: [], rawData: [] });
          }


        if (idObjs.includes(data?.id)) {
          // const microCagedData = data?.microCaged || [];
          // mudar isso aqui
          const empresasDataObj = {
            ativas: data?.empresas?.ativas?.filteredData || [],
            inativas: data?.empresas?.inativas?.filteredData || [],
            ativasSemMes: data?.empresas?.ativas?.filteredDataSemMes || [],
            inativasSemMes: data?.empresas?.inativas?.filteredDataSemMes || [],
          };

          setDataObj(empresasDataObj);

          clearInterval(intervalId);
        } else {
            setDataObj({ ativas: [], inativas: [], ativasSemMes: [], inativasSemMes: [] });
          }

        if (idObjsRawData.includes(data?.id)) {
          const empresasDataObj = { empresas: data?.empresas?.empresas?.filteredData || [], rawData: { mes: data?.empresas?.rawData?.mes?.filteredData || [], municipio: data?.empresas?.rawData?.municipio?.filteredData || [], municipioSemMes: data?.empresas?.rawData?.municipioSemMes?.filteredData || [] }, past: data?.empresas?.past?.filteredData || [] };

          setDataObjRawData(empresasDataObj);

          clearInterval(intervalId);
        } else {
            setDataObjRawData({ empresas: [], rawData: {mes: [], municipio: []}, past: [] });
          }
      }, 50);
  
      return () => clearInterval(intervalId);
    }, [data, pathname]);
  
    if (isLoading) return <LoadingScreen />;

    
  const isActiveTabDataReady = () => {
    switch (activeTab) {
      case "empresas-ativas":
      case "empresas-inativas":
        return !!dataArr?.length;
      case "empresas-ativas-inativas":
        return !!(dataObj?.ativas?.length || dataObj?.inativas?.length);
      case "empresas-naturezas":
      case "empresas-classes":
      case "comparativo-empresas-classes":
        return !!dataObjRawData?.empresas?.length;
      case "empresas-abertas-fechadas":
        return !!(dataTest?.empresas?.ativas?.length || dataTest?.empresas?.inativas?.length);
      case "empresas-tempo-abertura":
        return !!dataTestTwo?.empresas?.length;
      default:
        return !!dataArr?.length;
    }
  };

  const renderContent = () => {
    if (!data || !isActiveTabDataReady()) {
      return <div className="text-center text-gray-600">Construindo gráficos...</div>;
    }

    switch (activeTab) {
      case "empresas-ativas":
        return <EmpresasAtivas
        data={dataArr}
        dataSemMes={dataArrSemMes}
        dataSemMesPast={dataArrSemMesPast}
        year={getYearSelected(filters)}
        />
      case "empresas-inativas":
        return <EmpresasInativas
        data={dataArr}
        dataSemMes={dataArrSemMes}
        dataSemMesPast={dataArrSemMesPast}
        year={getYearSelected(filters)}
        />
      case "empresas-ativas-inativas":
        return <EmpresasAtivasInativas
        data={dataObj}
        year={getYearSelected(filters)}
        />
      case "empresas-naturezas":
        return <EmpresasNaturezas
        data={dataObjRawData} 
        year={getYearSelected(filters)} 
        />
      case "empresas-classes":
        return <EmpresasClasses
        data={dataObjRawData} 
        year={getYearSelected(filters)} 
        />     
      case "comparativo-empresas-classes":
        return <ComparativoClasses
        data={dataObjRawData} 
        year={getYearSelected(filters)} 
        />    
      case "empresas-abertas-fechadas":
        return <EmpresasAbertasFechadas
        data={dataTest} 
        year={getYearSelected(filters)} 
        />       
      case "empresas-tempo-abertura":
        return <EmpresasTempoAbertura
        data={dataTestTwo} 
        year={getYearSelected(filters)} 
        />        
        // "empresas-naturezas"
// empresas-abertas-fechadas

      // case "comparativo-mov":
      //   return <ComparativoMov
      //   data={microCaged} 
      //   year={getYearSelected(filters)} 
      //   /> 
      // case "comparativo-med":
      //   return <ComparativoMed
      //   data={microCagedMedia} 
      //   year={getYearSelected(filters)} 
      //   /> 
      // case "salario":
      //   return <Salario
      //   data={microCaged} 
      //   year={getYearSelected(filters)} 
      //   /> 
      default:
        return <EmpresasAtivas
        data={dataArr}
        dataSemMes={dataArrSemMes}
        dataSemMesPast={dataArrSemMesPast}
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
        Empresas
      </h1>

      <div className="bi-tabs">
        <button
          onClick={() => handleNavigation("empresas-ativas")}
          className={`bi-tab ${
            activeTab === "empresas-ativas"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Empresas Ativas  
        </button>
        <button
          onClick={() => handleNavigation("empresas-inativas")}
          className={`bi-tab ${
            activeTab === "empresas-inativas"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Empresas Inativas  
        </button>
        <button
          onClick={() => handleNavigation("empresas-ativas-inativas")}
          className={`bi-tab ${
            activeTab === "empresas-ativas-inativas"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Empresas Inativas X Ativas 
        </button>
        <button
          onClick={() => handleNavigation("empresas-naturezas")}
          className={`bi-tab ${
            activeTab === "empresas-naturezas"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Empresas Naturezas
        </button>
        <button
          onClick={() => handleNavigation("empresas-classes")}
          className={`bi-tab ${
            activeTab === "empresas-classes"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Ativas Geral NE
        </button>
        <button
          onClick={() => handleNavigation("comparativo-empresas-classes")}
          className={`bi-tab ${
            activeTab === "comparativo-empresas-classes"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Compartivo Ativas Geral NE
        </button>
        <button
          onClick={() => handleNavigation("empresas-abertas-fechadas")}
          className={`bi-tab ${
            activeTab === "empresas-abertas-fechadas"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Empresas Abertas e Fechadas  
        </button>
        <button
          onClick={() => handleNavigation("empresas-tempo-abertura")}
          className={`bi-tab ${
            activeTab === "empresas-tempo-abertura"
              ? "bi-tab-active"
              : ""
          }`}
        >
          Empresas Tempo Abertura  
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default EmpresasPage;
