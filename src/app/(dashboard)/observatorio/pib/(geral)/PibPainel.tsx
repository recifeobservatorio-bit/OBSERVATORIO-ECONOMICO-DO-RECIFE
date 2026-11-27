"use client";

import React, { useMemo, useState } from "react";

import Card from "@/components/@global/cards/Card";
import SectionIconBadge from "@/components/@global/cards/SectionIconBadge";
import LineChart from "@/components/@global/charts/LineChart";
import VerticalScrollableBarChart from "@/components/@global/charts/VerticalScrollableBarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import FitToScreen from "@/components/@global/features/FitToScreen";
import { PibIcon } from "@/components/@global/icons/sectionIcons";
import { isCapital } from "@/functions/process_data/observatorio/pib/geral/pibCapitais";
import ColorPalette from "@/utils/palettes/charts/ColorPalette";

// Página do PIB no mesmo desenho do Power BI:
//   cards (valor, variação, ranking entre as capitais do NE, ranking em PE)
//   Recife: tabela + linhas (valor e variação) | cidade comparada: tabela + linhas
//   barras: municípios e capitais do país.
// Recife fica fixo à esquerda; a cidade da direita é escolhida no seletor.

const PIB = "Produto Interno Bruto,  a preços correntes (R$ 1.000)";
const PER_CAPITA = "Produto Interno Bruto per capita,  a preços correntes (R$ 1,00)";
const MUN = "Município - UF";
const RECIFE = "Recife - PE";

const brl = (v: number, digits = 2) =>
  `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
const pct = (v: number | null) => (v == null ? "" : `${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`);

type Linha = { ano: number; atual: number; anterior: number | null; variacao: number | null };

const serieDo = (rows: any[], municipio: string, field: string): Linha[] => {
  const porAno = rows
    .filter((r) => r[MUN] === municipio)
    .map((r) => ({ ano: Number(r.Ano), valor: Number(r[field]) || 0 }))
    .sort((a, b) => a.ano - b.ano);
  return porAno.map((p, i) => {
    const anterior = i > 0 ? porAno[i - 1].valor : null;
    return {
      ano: p.ano,
      atual: p.valor,
      anterior,
      variacao: anterior ? Math.round(((p.valor - anterior) / anterior) * 10000) / 100 : null,
    };
  });
};

const TabelaAnual = ({ titulo, linhas, destaque }: { titulo: string; linhas: Linha[]; destaque?: boolean }) => (
  <div className="flex flex-col h-full min-h-0">
    <h3 className={`bi-chart-title text-center font-semibold ${destaque ? "!bg-[#E66C37]" : ""}`}>{titulo}</h3>
    <div className="flex-1 min-h-[220px] max-h-[330px] overflow-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-[#12239E] text-white">
          <tr>
            <th className="px-2 py-1 text-left">Ano</th>
            <th className="px-2 py-1 text-right">Ano Corrente</th>
            <th className="px-2 py-1 text-right">Ano Anterior</th>
            <th className="px-2 py-1 text-right">% Variação</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.ano} className="border-b border-gray-100 dark:border-gray-700">
              <td className="px-2 py-1">{l.ano}</td>
              <td className="px-2 py-1 text-right">{brl(l.atual)}</td>
              <td className="px-2 py-1 text-right">{l.anterior == null ? "" : brl(l.anterior)}</td>
              <td className={`px-2 py-1 text-right ${l.variacao != null && l.variacao < 0 ? "text-red-600" : ""}`}>{pct(l.variacao)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Linhas = ({ nome, linhas, capita, cor }: { nome: string; linhas: Linha[]; capita: boolean; cor: string }) => (
  <div className="flex flex-col gap-2 h-full">
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={linhas}
          title={capita ? `PIB Per Capita de ${nome}` : `PIB de ${nome} (x1000)`}
          colors={[cor]}
          xKey="ano"
          lines={[{ dataKey: "atual", name: capita ? "PIB per capita (R$)" : "PIB (R$ mil)" }]}
          height={150}
        />
      </ChartGrabber>
    </div>
    <div className="chart-wrapper">
      <ChartGrabber>
        <LineChart
          data={linhas.filter((l) => l.variacao != null)}
          title={capita ? `% Variação do PIB Per Capita de ${nome}` : `Variação do PIB de ${nome}`}
          colors={[cor]}
          xKey="ano"
          lines={[{ dataKey: "variacao", name: "Variação (%)" }]}
          tooltipEntry="%"
          height={150}
        />
      </ChartGrabber>
    </div>
  </div>
);

const PibPainel = ({ data, year, capita = false }: { data: any; year: string; capita?: boolean }) => {
  const field = capita ? PER_CAPITA : PIB;
  const all: any[] = data?.allData ?? [];
  const anoSel = Number(year) || Math.max(0, ...all.map((r) => Number(r.Ano) || 0));

  const municipios = useMemo(
    () => (Array.from(new Set(all.map((r) => r[MUN]))) as string[]).filter((m) => m && m !== RECIFE).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [all]
  );
  const [compare, setCompare] = useState("Fortaleza - CE");
  const outra = municipios.includes(compare) ? compare : municipios[0] ?? "";

  const recife = useMemo(() => serieDo(all, RECIFE, field), [all, field]);
  const comparada = useMemo(() => serieDo(all, outra, field), [all, outra, field]);

  const doAno = useMemo(() => all.filter((r) => Number(r.Ano) === anoSel), [all, anoSel]);
  const recifeAno = recife.find((l) => l.ano === anoSel);
  const valorRecife = recifeAno?.atual ?? 0;

  // Rankings como no Power BI: entre as capitais do Nordeste e entre os municípios de PE.
  const rankNE = doAno.filter((r) => r["Nome da Grande Região"] === "Nordeste" && isCapital(r[MUN]) && Number(r[field]) >= valorRecife).length;
  const rankPE = doAno.filter((r) => r["Sigla da Unidade da Federação"] === "PE" && Number(r[field]) >= valorRecife).length;

  const barrasMunicipios = useMemo(
    () => doAno.map((r) => ({ group: r[MUN], pib: Number(r[field]) || 0 })).sort((a, b) => b.pib - a.pib).slice(0, 100),
    [doAno, field]
  );
  const barrasCapitais = useMemo(
    () => doAno.filter((r) => isCapital(r[MUN])).map((r) => ({ group: r[MUN], pib: Number(r[field]) || 0 })).sort((a, b) => b.pib - a.pib),
    [doAno, field]
  );

  const nomeOutra = outra.replace(/ - /, " - ");

  return (
    <FitToScreen>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <Card title={capita ? "PIB Per Capita" : "PIB (x1000)"} data={valorRecife} year={String(anoSel)} color={ColorPalette.default[0]} />
          <Card title="Variação ao ano anterior (%)" data={recifeAno?.variacao ?? 0} year={String(anoSel)} color={ColorPalette.default[1]} />
          <Card title={capita ? "Ranking PIB Per Capita no NE (capitais)" : "Ranking PIB do Recife no NE (capitais)"} data={rankNE} year={String(anoSel)} color={ColorPalette.default[2]} position />
          {!capita && <Card title="Ranking PIB do Recife em PE" data={rankPE} year={String(anoSel)} color={ColorPalette.default[3]} position />}
        </div>

        <div className="flex justify-end items-center gap-2 text-xs" style={{ color: "var(--yaxis-tick-color)" }}>
          Comparar Recife com:
          <select
            className="border rounded px-2 py-1 text-xs bg-white dark:bg-[#0C1A28] dark:border-gray-600 max-w-[260px]"
            value={outra}
            onChange={(e) => setCompare(e.target.value)}
          >
            {municipios.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<PibIcon />} />
            <TabelaAnual titulo={capita ? "PIB Per Capita do Recife" : "PIB do Recife (x1000)"} linhas={recife} />
          </div>
          <div className="chart-content-wrapper relative">
            <Linhas nome="Recife" linhas={recife} capita={capita} cor={ColorPalette.default[0]} />
          </div>
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<PibIcon />} />
            <TabelaAnual titulo={capita ? `PIB Per Capita de ${nomeOutra}` : `PIB de ${nomeOutra} (x1000)`} linhas={comparada} destaque />
          </div>
          <div className="chart-content-wrapper relative">
            <Linhas nome={nomeOutra} linhas={comparada} capita={capita} cor="#E66C37" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<PibIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <VerticalScrollableBarChart
                  data={barrasMunicipios}
                  title={capita ? "PIB Per Capita Médio por Município" : "PIB em Relação aos Municípios (x1000)"}
                  xKey="group"
                  bars={[{ dataKey: "pib", name: capita ? "PIB per capita" : "PIB" }]}
                  colors={ColorPalette.default}
                  highlightValues={[RECIFE, outra]}
                  highlightColor="#EC6625"
                />
              </ChartGrabber>
            </div>
          </div>
          <div className="chart-content-wrapper relative">
            <SectionIconBadge icon={<PibIcon />} />
            <div className="chart-wrapper">
              <ChartGrabber>
                <VerticalScrollableBarChart
                  data={barrasCapitais}
                  title={capita ? "PIB Per Capita em Relação às Capitais do País" : "PIB em Relação às Capitais do País (x1000)"}
                  xKey="group"
                  bars={[{ dataKey: "pib", name: capita ? "PIB per capita" : "PIB" }]}
                  colors={ColorPalette.default}
                  highlightValues={[RECIFE, outra]}
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

export default PibPainel;
