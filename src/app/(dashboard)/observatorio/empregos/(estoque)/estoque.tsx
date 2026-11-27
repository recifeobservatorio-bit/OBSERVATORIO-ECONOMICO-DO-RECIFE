"use client";

import React, { useMemo } from "react";

import Card from "@/components/@global/cards/Card";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import LineChart from "@/components/@global/charts/LineChart";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { EmpregosIcon } from "@/components/@global/icons/sectionIcons";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Aba "Estoque de Vagas" do Power BI (Mercado de Trabalho). A base do CAGED não
// traz a região metropolitana, então a RM do Recife vem da lista do IBGE
// (15 municípios, com Goiana desde 2018). O gráfico com todas as RMs do país
// fica de fora até existir esse dado na base.
const RM_RECIFE = [
  "Abreu e Lima", "Araçoiaba", "Cabo de Santo Agostinho", "Camaragibe", "Goiana",
  "Igarassu", "Ilha de Itamaracá", "Ipojuca", "Itapissuma", "Jaboatão dos Guararapes",
  "Moreno", "Olinda", "Paulista", "Recife", "São Lourenço da Mata",
];

const norm = (s: string) =>
  String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/gi, "").toLowerCase();
const RM_KEYS = new Set(RM_RECIFE.map((m) => norm(`${m}-PE`)));
const isRmRecife = (municipio: string) => RM_KEYS.has(norm(municipio));
const nomeMunicipio = (municipio: string) =>
  RM_RECIFE.find((m) => norm(`${m}-PE`) === norm(municipio)) ?? String(municipio).replace(/-[A-Z]{2}$/, "");

const Estoque = ({ data, year }: { data: any; year: string }) => {
  const all: any[] = data?.allYears ?? [];

  const { serie, porMunicipio, mesRef, estoqueAtual } = useMemo(() => {
    const rows = all.filter((r) => isRmRecife(r.Municipio));
    // Série mensal do estoque da RM (soma dos municípios).
    const byKey = new Map<number, { Ano: number; Mes: number; label: string; estoque: number }>();
    rows.forEach((r) => {
      const ano = Number(r.Ano);
      const mes = Number(r.Mes);
      if (!ano || !(mes >= 1 && mes <= 12)) return;
      const key = ano * 100 + mes;
      const cur = byKey.get(key) ?? { Ano: ano, Mes: mes, label: `${monthShortName(mes)}/${ano}`, estoque: 0 };
      cur.estoque += Number(r.Estoque) || 0;
      byKey.set(key, cur);
    });
    const serie = Array.from(byKey.entries()).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

    // Estoque por município no último mês do ano filtrado (estoque não se soma entre meses).
    const doAno = serie.filter((p) => String(p.Ano) === String(year));
    const ref = doAno[doAno.length - 1] ?? serie[serie.length - 1];
    const porMunicipio = ref
      ? rows
          .filter((r) => Number(r.Ano) === ref.Ano && Number(r.Mes) === ref.Mes)
          .map((r) => ({ municipio: nomeMunicipio(r.Municipio), estoque: Number(r.Estoque) || 0 }))
          .sort((a, b) => b.estoque - a.estoque)
      : [];
    return { serie, porMunicipio, mesRef: ref, estoqueAtual: ref?.estoque ?? 0 };
  }, [all, year]);

  const refLabel = mesRef ? `${monthShortName(mesRef.Mes)}/${mesRef.Ano}` : year;

  return (
    <FitToScreen>
      <div>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Card title={`Estoque da Região Metropolitana do Recife (${refLabel})`} data={estoqueAtual} year={year} color={ColorPalette.default[0]} />
          <Card title="Municípios da RM do Recife" data={RM_RECIFE.length} year={year} color={ColorPalette.default[1]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4">
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<EmpregosIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <LineChart
                  data={serie}
                  title="Estoque da Região Metropolitana do Recife"
                  colors={[ColorPalette.default[0]]}
                  xKey="label"
                  lines={[{ dataKey: "estoque", name: "Estoque" }]}
                />
              </ChartGrabber>
            </div>
          </div>
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<EmpregosIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <VerticalScrollableBarChart
                  data={porMunicipio}
                  title={`Estoque da RM do Recife por Município (${refLabel})`}
                  xKey="municipio"
                  bars={[{ dataKey: "estoque", name: "Estoque" }]}
                  colors={ColorPalette.default}
                  highlightValues={["Recife"]}
                  highlightColor="#EC6625"
                />
              </ChartGrabber>
            </div>
          </div>
        </div>
      </div>
    </FitToScreen>
  );
};

export default Estoque;
