import React, { useState, useEffect, useRef } from "react";

import { PortoGeralData, PortoOperacaoData, RawDataPortos } from "@/@types/observatorio/@data/portoData";
import { PortoAtracacaoHeaders, PortoCargaHeaders } from "@/@types/observatorio/@fetch/porto";
import { ChartBuild } from "@/@types/observatorio/shared";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import { CardsCarousel } from "@/components/@global/features/CardsCarousel";
import FitToScreen from "@/components/@global/features/FitToScreen";
import SelectPrincipal from "@/components/@global/features/SelectPrincipal";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { PortosIcon } from "@/components/@global/icons/sectionIcons";
import { getFilteredData, rearrangeArray } from "@/functions/process_data/observatorio/porto/comparativo/charts/filteredPortoData";
import { getUniqueValues } from "@/utils/filters/@global/getUniqueValues";
import ErrorBoundary from "@/utils/loader/errorBoundary";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import cards from "./@imports/cards";
import charts from "./@imports/charts";
import tables from "./@imports/tables";

const Comparativo = ({
  year,
  data,
  toCompare = getUniqueValues<PortoAtracacaoHeaders, "Porto Atracação">(
    "filteredData" in data.atracacao ? data.atracacao.filteredData : data.atracacao,
    "Porto Atracação"
  ),
  months
}: ChartBuild<PortoGeralData>) => {

  const [pageCompare, setPageCompare] = useState(0);
  
  const [tempFiltred, setTempFiltered] = useState([]);
  const [tablesRender, setTablesRender] = useState([charts]);

  const [tableOrder, setTableOrder] = useState(tables.map((_, index) => index));

  const [portosDataFiltered, setPortosDataFiltered] = useState<{
    porto: string;
    atracacao: PortoAtracacaoHeaders[];
    cargas: PortoCargaHeaders[];
  }[]>([]);

  // Mesmo recorte por porto, mas com a série histórica completa (todos os anos) —
  // usada pelo modo "Ano" do toggle Mês/Ano em OperacaoCargasAno.
  const [portosDataFilteredPorAno, setPortosDataFilteredPorAno] = useState<{
    porto: string;
    atracacao: PortoAtracacaoHeaders[];
    cargas: PortoCargaHeaders[];
  }[]>([]);

  const sortableContainerTableRef = useRef<HTMLDivElement>(null);

const attTempFiltred = ['Recife', ...tempFiltred]

useEffect(() => {
  const portosDataFiltered = getFilteredData(data.rawData as RawDataPortos, attTempFiltred);
  const portosDataFilteredPorAno = getFilteredData(
    { atracacao: data.atracacaoPorAno ?? [], carga: data.cargaPorAno ?? [] } as RawDataPortos,
    attTempFiltred
  );

    const getNewTables = tempFiltred.map((val) => {
      return [...charts];
    });

    setPortosDataFiltered(portosDataFiltered)
    setPortosDataFilteredPorAno(portosDataFilteredPorAno)
    setTablesRender([[...charts], ...getNewTables]);
  }, [tempFiltred, data]);

  const absoluteDivRef = useRef<HTMLDivElement>(null);

  const singlePorto = tablesRender.length === 1;

  return (
    <FitToScreen>
    <div>
      <SelectPrincipal
        options={toCompare}
        filters={tempFiltred}
        setFilters={setTempFiltered}
        label="Compare Portos"
        placeholder="Digite para buscar um porto"
        notFoundMessage="Nenhum porto encontrado"
        unique
      />

      <CardsCarousel absoluteDivRef={absoluteDivRef} dataPassed={attTempFiltred} pageCompare={pageCompare} setPageCompare={setPageCompare} textDefault="Selecione um aeroporto para as informações serem comparadas" >
        {attTempFiltred.map((toCompare: string, index: number) => {
          return cards.slice(0, 1).map(({ Component }) => {
                      
            return (
              <React.Suspense fallback={<div>Carregando...</div>} key={index}>
                <div
                 ref={absoluteDivRef} 
                 className={`${
                    toCompare === attTempFiltred[pageCompare]
                     ? ''
                     : 'translate-x-[100%]'
                    } absolute inset-x-0`}
                 >
                 <ErrorBoundary>
                    <Component local={attTempFiltred[pageCompare]} 
                    data={{ 
                      ...data, 
                      atracacao: portosDataFiltered.find((obj) => obj.porto == ["Recife", ...tempFiltred][index])?.['atracacao'] || [] as PortoAtracacaoHeaders[], 
                      carga: portosDataFiltered.find((obj) => obj.porto == ["Recife", ...tempFiltred][index])?.['cargas'] || [], 
                    } as PortoGeralData & PortoOperacaoData[]}
                      cards={cards.slice(1)} year={year ?? "2024"} color={ColorPalette.default} />
                  </ErrorBoundary>
                  </div>
                </React.Suspense>
                      )});
                    })}
       </CardsCarousel>

      {/* Só Recife (sem porto comparado): linha + 3 gráficos numa grade 2×2 —
          antes a linha ocupava a largura toda e os outros 3 iam pra baixo. Os
          dois blocos viram "contents" pra seus cards entrarem na mesma grade. */}
      <div className={singlePorto ? "grid bi-grid-2x2 grid-cols-1 lg:grid-cols-2 gap-6 pb-4" : "flex flex-col gap-6"}>
       
      <SortableDiv chartOrder={tableOrder} setChartOrder={setTableOrder} sortableContainerRef={sortableContainerTableRef} style={singlePorto ? "contents" : "charts-items-wrapper 2xl:!grid-cols-2"}>
        {tablesRender.map((arrChart, index) => {

        return arrChart.slice(0, 1).map(({ Component }) => {
            return (
              <div key={index} className="chart-content-wrapper relative">
              <SectionIconBadge icon={<PortosIcon />} />
              <React.Suspense fallback={<div>Carregando...</div>}>
                <Component
                  porto={["Recife", ...tempFiltred][index]}
                  color={ColorPalette.default[index]}
                  data={{ ...data,
                    atracacao: portosDataFiltered.find((obj) => obj.porto == ["Recife", ...tempFiltred][index])?.['atracacao'] || [],
                    carga: portosDataFiltered.find((obj) => obj.porto == ["Recife", ...tempFiltred][index])?.['cargas'] || [],
                    atracacaoPorAno: portosDataFilteredPorAno.find((obj) => obj.porto == ["Recife", ...tempFiltred][index])?.['atracacao'] || [],
                    cargaPorAno: portosDataFilteredPorAno.find((obj) => obj.porto == ["Recife", ...tempFiltred][index])?.['cargas'] || [],
                  }}
                  year={year}
                  months={months}
                />
              </React.Suspense>
            </div>
          )})})}
      </SortableDiv> 

      <SortableDiv chartOrder={tableOrder} setChartOrder={setTableOrder} sortableContainerRef={sortableContainerTableRef} style={singlePorto ? "contents" : "flex flex-wrap items-stretch gap-6 pb-16"}>
          {(tablesRender.length > 1 ? rearrangeArray(tablesRender).slice(2) : tablesRender[0].slice(1)).map(({ Component }, index) => {
              // isso é para escolher qual porto ele vai pegar no tempfitred
              const virtuaIndex = tablesRender.length > 1 ? (index % 2 === 0 ? 0 : 1) : 0

              return (
                <React.Fragment key={index}>
                  <div key={index} className={`chart-content-wrapper relative grow basis-full sm:basis-[calc(50%-0.75rem)] xl:basis-[calc(33.333%-1rem)]`}>
                    <SectionIconBadge icon={<PortosIcon />} />
                    <React.Suspense fallback={<div>Carregando...</div>}>
                      <Component
                        porto={["Recife", ...tempFiltred][virtuaIndex]}
                        color={ColorPalette.default[virtuaIndex]}
                        data={{ 
                          ...data, 
                          atracacao: portosDataFiltered.find((obj) => obj.porto == ["Recife", ...tempFiltred][virtuaIndex])?.['atracacao'] || [], 
                          carga: portosDataFiltered.find((obj) => obj.porto == ["Recife", ...tempFiltred][virtuaIndex])?.['cargas'] || [], 
                        }}
                        year={year}
                      />
                    </React.Suspense>
                  </div>
                </React.Fragment>
            )})}
        </SortableDiv>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Comparativo;


 