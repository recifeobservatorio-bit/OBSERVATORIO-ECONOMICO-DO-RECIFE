"use client";

import React, { useMemo, useState } from "react";

import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import LineChart from "@/components/@global/charts/LineChart";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { EmpregosIcon } from "@/components/@global/icons/sectionIcons";
import { useDashboard } from "@/context/DashboardContext";
import { REGIOES_METROPOLITANAS } from "@/utils/dicts/empregos/regioesMetropolitanas";
import { getMonths } from "@/utils/filters/@global/getMonths";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Aba "Estoque de Vagas" no desenho do Power BI (Mercado de Trabalho):
//   cards: RM do Recife | RM selecionada | total das regiões metropolitanas
//   linhas: estoque da RM do Recife | da RM selecionada   + barra: estoque por RM
//   barras: municípios da RM do Recife | da RM selecionada
// Composição das RMs: IBGE 2025 (utils/dicts/empregos/regioesMetropolitanas.ts).
// Estoque não se soma entre meses: os cards e barras usam um mês de referência
// (o mês filtrado, ou o último disponível no ano filtrado).

const RECIFE = "Recife-PE";
const NAVY = "#12239E";
const ORANGE = "#E66C37";
const PURPLE = "#6B007B";

const codigo = (r: any) => String(r["Código"] ?? "").split(".")[0].padStart(6, "0");
const fmt = (v: number | null | undefined) => (v == null ? "--" : Number(v).toLocaleString("pt-BR"));

// Município → RMs (alguns municípios estão em mais de uma).
const RMS_DO_MUNICIPIO = (() => {
  const m = new Map<string, string[]>();
  Object.entries(REGIOES_METROPOLITANAS).forEach(([rm, cods]) => cods.forEach((c) => m.set(c, [...(m.get(c) ?? []), rm])));
  return m;
})();

const CardGrupo = ({ titulo, cor, itens }: { titulo: string; cor: string; itens: { rotulo: string; valor: string }[] }) => (
  <div className="bi-kpi flex-1 min-w-[280px] bg-white dark:bg-[#0C1A28] rounded-md shadow overflow-hidden">
    <div className="text-center text-white font-semibold text-sm py-1" style={{ background: cor }}>{titulo}</div>
    <div className="grid grid-cols-2">
      {itens.map((it) => (
        <div key={it.rotulo} className="px-3 py-2 border-l-4" style={{ borderColor: cor }}>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{it.rotulo}</div>
          <div className="text-2xl font-bold text-[#12239E] dark:text-gray-100">{it.valor}</div>
        </div>
      ))}
    </div>
  </div>
);

const Vazio = ({ titulo }: { titulo: string }) => (
  <div className="h-full flex flex-col">
    <h3 className="bi-chart-title text-center font-semibold" style={{ background: ORANGE }}>{titulo}</h3>
    <div className="flex-1 min-h-[200px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 text-center px-4">
      Selecione uma região metropolitana para comparar
    </div>
  </div>
);

const Estoque = ({ data, year }: { data: any; year: string }) => {
  const { filters } = useDashboard();
  const all: any[] = data?.allYears ?? [];
  const [rmSel, setRmSel] = useState("");

  const opcoes = useMemo(
    () => Object.keys(REGIOES_METROPOLITANAS).filter((rm) => rm !== RECIFE).sort((a, b) => a.localeCompare(b, "pt-BR")),
    []
  );

  // Uma passada na base: estoque por RM e mês, e por município/mês (só municípios de RM).
  const { porRmMes, porMunMes, nomes, meses } = useMemo(() => {
    const porRmMes = new Map<string, Map<number, number>>();
    const porMunMes = new Map<string, Map<number, number>>();
    const nomes = new Map<string, string>();
    const meses = new Set<number>();
    all.forEach((r) => {
      const cod = codigo(r);
      const rms = RMS_DO_MUNICIPIO.get(cod);
      if (!rms) return;
      const ano = Number(r.Ano);
      const mes = Number(r.Mes);
      if (!ano || !(mes >= 1 && mes <= 12)) return;
      const key = ano * 100 + mes;
      const est = Number(r.Estoque) || 0;
      meses.add(key);
      nomes.set(cod, String(r.Municipio));
      const mm = porMunMes.get(cod) ?? new Map<number, number>();
      mm.set(key, (mm.get(key) ?? 0) + est);
      porMunMes.set(cod, mm);
      rms.forEach((rm) => {
        const rmm = porRmMes.get(rm) ?? new Map<number, number>();
        rmm.set(key, (rmm.get(key) ?? 0) + est);
        porRmMes.set(rm, rmm);
      });
    });
    return { porRmMes, porMunMes, nomes, meses: Array.from(meses).sort((a, b) => a - b) };
  }, [all]);

  // Mês de referência: o filtrado (se for um só) ou o último do ano filtrado.
  const mesFiltro = getMonths(filters, true)?.selected;
  const mesUnico = Array.isArray(mesFiltro) && mesFiltro.length === 1 ? monthOptionIndex(String(mesFiltro[0])) : 0;
  const doAno = meses.filter((k) => Math.floor(k / 100) === Number(year));
  const ref = (mesUnico && doAno.find((k) => k % 100 === mesUnico)) || doAno[doAno.length - 1] || meses[meses.length - 1];
  const refLabel = ref ? `${monthShortName(ref % 100)}/${Math.floor(ref / 100)}` : String(year);

  const serie = (rm: string) =>
    Array.from(porRmMes.get(rm)?.entries() ?? [])
      .sort((a, b) => a[0] - b[0])
      .map(([k, v]) => ({ label: `${monthShortName(k % 100)}/${Math.floor(k / 100)}`, estoque: v }));
  const municipios = (rm: string) =>
    (REGIOES_METROPOLITANAS[rm] ?? [])
      .map((cod) => ({ municipio: nomes.get(cod) ?? cod, estoque: porMunMes.get(cod)?.get(ref) ?? 0 }))
      .filter((m) => m.estoque > 0)
      .sort((a, b) => b.estoque - a.estoque);
  const estoqueRm = (rm: string) => porRmMes.get(rm)?.get(ref);

  const porRm = useMemo(
    () =>
      Object.keys(REGIOES_METROPOLITANAS)
        .map((rm) => ({ rm, estoque: porRmMes.get(rm)?.get(ref) ?? 0 }))
        .filter((x) => x.estoque > 0)
        .sort((a, b) => b.estoque - a.estoque),
    [porRmMes, ref]
  );
  const totalRms = porRm.reduce((s, x) => s + x.estoque, 0);

  const temSel = !!rmSel && !!REGIOES_METROPOLITANAS[rmSel];

  return (
    <FitToScreen>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <CardGrupo
            titulo={`Região Metropolitana - ${RECIFE}`}
            cor={NAVY}
            itens={[
              { rotulo: "Estoque", valor: fmt(estoqueRm(RECIFE)) },
              { rotulo: "Total de municípios", valor: fmt(REGIOES_METROPOLITANAS[RECIFE]?.length) },
            ]}
          />
          <CardGrupo
            titulo={temSel ? `Região Metropolitana - ${rmSel}` : "Selecione uma região metropolitana"}
            cor={ORANGE}
            itens={[
              { rotulo: "Estoque", valor: temSel ? fmt(estoqueRm(rmSel)) : "--" },
              { rotulo: "Total de municípios", valor: temSel ? fmt(REGIOES_METROPOLITANAS[rmSel].length) : "--" },
            ]}
          />
          <CardGrupo
            titulo="Total de regiões metropolitanas"
            cor={PURPLE}
            itens={[
              { rotulo: "Estoque por RM", valor: fmt(totalRms) },
              { rotulo: "Qtd Regiões", valor: fmt(porRm.length) },
            ]}
          />
        </div>

        <div className="flex justify-end items-center gap-2 text-xs" style={{ color: "var(--yaxis-tick-color)" }}>
          Mês de referência: <b>{refLabel}</b> · Região metropolitana para comparar:
          <select
            className="border rounded px-2 py-1 text-xs bg-white dark:bg-[#0C1A28] dark:border-gray-600"
            value={rmSel}
            onChange={(e) => setRmSel(e.target.value)}
          >
            <option value="">Selecione…</option>
            {opcoes.map((rm) => (
              <option key={rm} value={rm}>{rm}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<EmpregosIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <LineChart
                  data={serie(RECIFE)}
                  title={`Estoque da Região Metropolitana - ${RECIFE}`}
                  colors={[NAVY]}
                  xKey="label"
                  lines={[{ dataKey: "estoque", name: "Estoque" }]}
                  height={220}
                />
              </ChartGrabber>
            </div>
          </div>
          <div className="chart-content-wrapper relative">
            {temSel ? (
              <div className="chart-wrapper">
                <ChartGrabber>
                  <LineChart
                    data={serie(rmSel)}
                    title={`Estoque da Região Metropolitana - ${rmSel}`}
                    colors={[ORANGE]}
                    xKey="label"
                    lines={[{ dataKey: "estoque", name: "Estoque" }]}
                    height={220}
                  />
                </ChartGrabber>
              </div>
            ) : (
              <Vazio titulo="Selecione uma região metropolitana" />
            )}
          </div>
          <div className="chart-content-wrapper relative lg:row-span-2">
            <SectionIconBadge icon={<EmpregosIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <VerticalScrollableBarChart
                  data={porRm}
                  title={`Estoque por Regiões Metropolitanas (${refLabel})`}
                  xKey="rm"
                  bars={[{ dataKey: "estoque", name: "Estoque" }]}
                  colors={[NAVY]}
                  highlightValues={[RECIFE, ...(temSel ? [rmSel] : [])]}
                  highlightColor={ORANGE}
                />
              </ChartGrabber>
            </div>
          </div>

          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<EmpregosIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <VerticalScrollableBarChart
                  data={municipios(RECIFE)}
                  title={`Estoque da região ${RECIFE} por município (${refLabel})`}
                  xKey="municipio"
                  bars={[{ dataKey: "estoque", name: "Estoque" }]}
                  colors={[NAVY]}
                  highlightValues={["Recife-PE"]}
                  highlightColor={ORANGE}
                />
              </ChartGrabber>
            </div>
          </div>
          <div className="chart-content-wrapper relative">
            {temSel ? (
              <div className="chart-wrapper">
                <ChartGrabber>
                  <VerticalScrollableBarChart
                    data={municipios(rmSel)}
                    title={`Estoque da região ${rmSel} por município (${refLabel})`}
                    xKey="municipio"
                    bars={[{ dataKey: "estoque", name: "Estoque" }]}
                    colors={[ORANGE]}
                  />
                </ChartGrabber>
              </div>
            ) : (
              <Vazio titulo="Selecione uma região metropolitana" />
            )}
          </div>
        </div>
      </div>
    </FitToScreen>
  );
};

export default Estoque;
