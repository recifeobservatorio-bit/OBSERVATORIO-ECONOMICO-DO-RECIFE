"use client";

import React, { useMemo } from "react";

// Cards "Ranking - Recife" / "Selecione o aeroporto" do Power BI (Aeroportos
// Comparativo): posição de cada aeroporto entre todos os aeroportos do recorte
// filtrado, em passageiros, cargas e decolagens.

type Totais = { passageiros: number; cargas: number; decolagens: number };

const NAVY = "#12239E";
const ORANGE = "#E66C37";

const posicao = (mapa: Map<string, Totais>, nome: string, campo: keyof Totais) => {
  const alvo = mapa.get(nome)?.[campo];
  if (alvo == null) return null;
  let pos = 1;
  mapa.forEach((t) => {
    if (t[campo] > alvo) pos += 1;
  });
  return pos;
};

const Grupo = ({ titulo, cor, nome, mapa }: { titulo: string; cor: string; nome?: string; mapa: Map<string, Totais> }) => {
  const itens: { rotulo: string; campo: keyof Totais }[] = [
    { rotulo: "Passageiros", campo: "passageiros" },
    { rotulo: "Cargas (Kg)", campo: "cargas" },
    { rotulo: "Decolagens", campo: "decolagens" },
  ];
  return (
    <div className="bi-kpi flex-1 min-w-[280px] bg-white dark:bg-[#0C1A28] rounded-md shadow overflow-hidden">
      <div className="text-center text-white font-semibold text-sm py-1" style={{ background: cor }}>{titulo}</div>
      <div className="grid grid-cols-3">
        {itens.map((it) => {
          const p = nome ? posicao(mapa, nome, it.campo) : null;
          return (
            <div key={it.campo} className="px-3 py-2 border-l-4" style={{ borderColor: cor }}>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{it.rotulo}</div>
              <div className="text-2xl font-bold text-[#12239E] dark:text-gray-100">{p == null ? "--" : `${p}º`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RankingAeroportos = ({ data = [], base = "Recife", outro }: { data: any[]; base?: string; outro?: string }) => {
  const mapa = useMemo(() => {
    const m = new Map<string, Totais>();
    data.forEach((r: any) => {
      const nome = r["AEROPORTO NOME"];
      if (!nome) return;
      const t = m.get(nome) ?? { passageiros: 0, cargas: 0, decolagens: 0 };
      t.passageiros += Number(r["PASSAGEIRO"]) || 0;
      t.cargas += Number(r["CARGA"]) || 0;
      t.decolagens += Number(r["DECOLAGENS"]) || 0;
      m.set(nome, t);
    });
    return m;
  }, [data]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Grupo titulo={`Ranking - ${base}`} cor={NAVY} nome={base} mapa={mapa} />
      <Grupo titulo={outro ? `Ranking - ${outro}` : "Selecione o aeroporto"} cor={ORANGE} nome={outro} mapa={mapa} />
    </div>
  );
};

export default RankingAeroportos;
