import React, { useState, useEffect, useRef } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import FitToScreen from "@/components/@global/features/FitToScreen";
import SelectCompare from "@/components/@global/features/SelectCompare";
import SelectPrincipal from "@/components/@global/features/SelectPrincipal";
import { SortableDiv } from "@/components/@global/features/SortableDiv";
import { EmpregosIcon } from "@/components/@global/icons/sectionIcons";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { raisCboDicts } from "@/utils/dicts/rais/raisCboDicts";
import { raisCodCboDicts } from "@/utils/dicts/rais/raisCodCboDicts";
import { getUniqueValues } from "@/utils/filters/@global/getUniqueValues";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

import VariacaoSaldoComparativo from "@/components/@build/observatorio/charts/empregos/comparativo/VariacaoSaldoComparativo";
import cards from "./@imports/cards";
import charts from "./@imports/charts";
import tables from "./@imports/tables";

// AEROPORTO NOME

const Comparativo = ({
  year,
  data,
  toCompare = getUniqueValues<any, "Municipio">(
    data['caged'],
    "Municipio"
  ),
}: {
  year: string;
  toCompare?: any;
  data: any;
}) => {
  const [tempFiltred, setTempFiltred] = useState([]);
  const [tablesRender, setTablesRender] = useState(tables);

  const [tableOrder, setTableOrder] = useState(tables.map((_, index) => index));

  // REF do container e REF da instância do Sortable
  const sortableContainerTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getNewTables = tempFiltred.map((val) => {
      return tables[0]
    });

    // setTablesRender([...tables, ...getNewTables]);
    setTablesRender([...getNewTables]);
  }, [tempFiltred]);

  // const cboOption = toCompare.map((opt: string) => `${raisCboDicts[opt]}`)

  return (
    <FitToScreen>
    <div>
         <SelectPrincipal
          options={toCompare}
          initialValue={['Recife-PE']}
          noRecife={false}
          filters={tempFiltred}
          setFilters={setTempFiltred}
          label="Compare Municípios"
          placeholder="Digite para buscar um município e comparar com o Recife"
          notFoundMessage="Nenhuma município encontrado"
        />



      <div className="flex flex-col gap-6">
        {/* <SortableDiv chartOrder={tableOrder} setChartOrder={setTableOrder} sortableContainerRef={sortableContainerTableRef} style="charts-items-wrapper !grid-cols-1">
          {tableOrder.map((index) => { 
            const { Component } = tables[index];

            return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg flex flex-col items-center w-full min-h-[800px]"
            >
                <Component
                  municipio={[...tempFiltred]}
                  color={ColorPalette.default[index]}
                  data={data}
                  year={year}
                />
            </div>
          )})}
        </SortableDiv> */}

        {/* Sem um 2º município escolhido não havia nada indicando que dá pra comparar. */}
        {tempFiltred.length < 2 && (
          <p className="text-center w-full text-gray-700 dark:text-gray-300">
            Selecione um município para as informações serem comparadas
          </p>
        )}

        {/* Linha de saldo mensal dos municípios escolhidos, como no Power BI. */}
        {tempFiltred.length > 0 && (
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<EmpregosIcon />} />
            <VariacaoSaldoComparativo data={data["caged"]} municipios={[...tempFiltred]} year={year} />
          </div>
        )}

        <SortableDiv chartOrder={tableOrder} setChartOrder={setTableOrder} sortableContainerRef={sortableContainerTableRef} style="charts-items-wrapper">
          {tablesRender.map(({ Component }, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg flex flex-col items-center w-full only:col-span-full relative"
            >
              <SectionIconBadge icon={<EmpregosIcon />} />
              <React.Suspense fallback={<div>Carregando...</div>}>
                <Component
                  municipio={[...tempFiltred][index]}
                  color={ColorPalette.default[index]}
                  data={data['caged'].filter((data: any) => data['Municipio'] === [...tempFiltred][index])}
                  year={year}
                />
              </React.Suspense>
            </div>
          ))}
          {/* Reserva o lugar da 2ª tabela enquanto nenhuma cidade foi escolhida. */}
          {tempFiltred.length === 1 && (
            <div className="chart-content-wrapper relative flex items-center justify-center min-h-[300px] text-center text-gray-500 dark:text-gray-400">
              Escolha uma cidade para comparar
            </div>
          )}
        </SortableDiv>
      </div>
    </div>
    </FitToScreen>
  );
};

export default Comparativo;
