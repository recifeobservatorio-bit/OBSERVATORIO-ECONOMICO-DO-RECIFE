"use client";

import { useEffect, useState } from "react";

import { EmpresasData } from "@/@api/http/to-charts/empresas/EmpresasData";
import LineChart from "@/components/@global/charts/LineChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import MesAnoToggle from "@/components/@global/features/MesAnoToggle";
import GraphSkeleton from "@/components/random_temp/GraphSkeleton";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import { getDateKeys } from "@/utils/formatters/getDataKeys";
import { getObjToArr } from "@/utils/formatters/getObjToArr";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

const EmpresasAtivasClassesMes = ({
  data,
  toCompare,
  color = ColorPalette.default,
  title = "Quantidade de Empresas Classes no Recife",
  }: any) => {
    const [mode, setMode] = useState<"ano" | "mes">("ano");
    const [anoRows, setAnoRows] = useState<any[] | null>(null);

    useEffect(() => {
      let cancelled = false;
      new EmpresasData("").fetchAllYearsClasses().then((rows) => {
        if (cancelled) return;
        setAnoRows(rows);
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (mode === "ano" && !anoRows) {
      return (
        <div className="chart-wrapper">
          <GraphSkeleton />
        </div>
      );
    }

    const dataRawData = data

    let chartData: any[] = []

    if (mode === "ano") {
      // Série histórica multianual, uma coluna por município comparado — busca todos os
      // municípios/anos do arquivo (ignora o filtro de ano/mês da aba).
      const byYear = new Map<string, any>()
      ;(anoRows || []).forEach((row: any) => {
        if (!toCompare.includes(row['Municipio'])) return
        const ano = String(row['Ano'])
        if (!byYear.has(ano)) byYear.set(ano, { label: ano })
        const entry = byYear.get(ano)
        entry[row['Municipio']] = (entry[row['Municipio']] || 0) + (row['Estabelecimentos'] || 0)
      })
      chartData = Array.from(byYear.values()).sort((a, b) => +a.label - +b.label)
    } else {
      // "Mês" ignora o filtro de mês ('mes' já vem sem esse filtro aplicado) e mostra todos
      // os meses do ano selecionado no filtro.
      const dataArr = toCompare.map((compare: string) => getObjToArr(dataRawData?.[compare]?.['municipio']?.['mes']).map((obj: any) => ({ ...obj, name: compare }))).flat()

      const dataCorrect: any[] = []

      for (let i = 0; i < dataArr.length; i++) {
        const dataMonth = dataCorrect.findIndex((val: any) => val['label'] === dataArr[i]['label'])

        if (dataCorrect[dataMonth]) {
          dataCorrect[dataMonth] = { ...dataCorrect[dataMonth], [dataArr[i]['name']]: dataArr[i]['value'] }
          continue
        }

        dataCorrect.push({ label: dataArr[i]['label'], [dataArr[i]['name']]: dataArr[i]['value'] })
      }

      chartData = dataCorrect.map((dataMap: any) => ({ ...dataMap, label: monthShortName(+dataMap.label)}))
    }

    return (
      <div className="chart-wrapper">
        <ChartGrabber>
          <LineChart
            data={chartData}
            title={title}
            underTitle={<MesAnoToggle mode={mode} onChange={setMode} />}
            colors={color}
            xKey="label"
            lines={[...getDateKeys(toCompare ?? [])]}
          />
        </ChartGrabber>
      </div>
    );
  };

export default EmpresasAtivasClassesMes;
