"use client";

import { useMemo, useState } from "react";

import TableGeneric from "@/components/@global/tables/TableGeneric";
import { raisClassesDicts } from "@/utils/dicts/rais/raisClassesDicts";
import { tooltipFormatter } from "@/utils/formatters/@global/graphFormatter";

type Metrics = {
  totalEstoque: number;
  mediaSM: number;
  mediaNom: number;
  maiorRemuneracao: number;
  celetistas: number;
  estatutarios: number;
};

function computeMetrics(rows: any[]): Metrics {
  let sumSM = 0;
  let countSM = 0;
  let sumNom = 0;
  let countNom = 0;
  let maior = 0;
  let celetistas = 0;
  let estatutarios = 0;

  for (const r of rows) {
    const sm = r["Vl Remun Dezembro (SM)"];
    const nom = r["Vl Remun Dezembro Nom"];
    if (sm) {
      sumSM += sm;
      countSM += 1;
    }
    if (nom) {
      sumNom += nom;
      countNom += 1;
      if (nom > maior) maior = nom;
    }
    const vinc: string = r["Tipo Vínculo"] || "";
    if (vinc.startsWith("CLT")) celetistas += 1;
    else if (vinc.startsWith("ESTAT")) estatutarios += 1;
  }

  return {
    totalEstoque: rows.length,
    mediaSM: countSM ? sumSM / countSM : 0,
    mediaNom: countNom ? sumNom / countNom : 0,
    maiorRemuneracao: maior,
    celetistas,
    estatutarios,
  };
}

const money = (v: number) => tooltipFormatter(Math.round(v * 100) / 100);

const SalariosTabela = ({ data = [], color = "#f97316" }: any) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Agrupar/computar métricas sobre ~25k linhas é caro — memoiza por referência de `data`, senão
  // recalcula em toda renderização (inclusive só de abrir/fechar uma classe), travando a aba.
  const classeRows = useMemo(() => {
    // Nível 1: agrupa por Classe CNAE (5 dígitos), decodificada via raisClassesDicts.
    const byClasse = new Map<string, any[]>();
    for (const r of data) {
      const cnae = r["CNAE Código"];
      if (!cnae) continue;
      const classe = cnae.slice(0, 5);
      const bucket = byClasse.get(classe);
      if (bucket) bucket.push(r);
      else byClasse.set(classe, [r]);
    }

    return Array.from(byClasse.entries())
      .map(([classe, rows]) => ({
        classe,
        label: raisClassesDicts[classe] || classe,
        rows,
        metrics: computeMetrics(rows),
      }))
      .sort((a, b) => b.metrics.totalEstoque - a.metrics.totalEstoque);
  }, [data]);

  const toggle = (classe: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(classe)) next.delete(classe);
      else next.add(classe);
      return next;
    });
  };

  const headers = [
    "Classe",
    "Total Estoque",
    "Média de Salário Mínimo",
    "Remuneração Média Dez. Nominal",
    "Maior Remuneração",
    "Total de Celetistas Ativos",
    "Total de Estatutários Ativos",
  ];

  const metricsRow = (m: Metrics) => [
    tooltipFormatter(m.totalEstoque),
    money(m.mediaSM),
    money(m.mediaNom),
    money(m.maiorRemuneracao),
    tooltipFormatter(m.celetistas),
    tooltipFormatter(m.estatutarios),
  ];

  // Idem: montar as linhas (inclusive as sublinhas de uma classe aberta) é feito de novo aqui
  // pra não recomputar em toda renderização não relacionada — só quando classeRows ou expanded
  // realmente mudam.
  const rows: React.ReactNode[][] = useMemo(() => {
    const built: React.ReactNode[][] = [];
    for (const c of classeRows) {
      const isOpen = expanded.has(c.classe);
      built.push([
        <button
          key={c.classe}
          onClick={() => toggle(c.classe)}
          className="flex items-center gap-2 font-semibold w-full text-left"
        >
          <span className="inline-block w-3">{isOpen ? "▾" : "▸"}</span>
          {c.label}
        </button>,
        ...metricsRow(c.metrics),
      ]);

      if (!isOpen) continue;

      // Nível 2 (subatividades): agrupa por Subclasse (CNAE Código completo, 7 dígitos).
      const bySub = new Map<string, any[]>();
      for (const r of c.rows) {
        const sub = r["CNAE Código"];
        const bucket = bySub.get(sub);
        if (bucket) bucket.push(r);
        else bySub.set(sub, [r]);
      }

      const subRows = Array.from(bySub.entries())
        .map(([sub, subrows]) => ({ sub, metrics: computeMetrics(subrows) }))
        .sort((a, b) => b.metrics.totalEstoque - a.metrics.totalEstoque);

      for (const s of subRows) {
        built.push([
          <span key={s.sub} className="pl-7 text-gray-500 dark:text-gray-400">
            {s.sub}
          </span>,
          ...metricsRow(s.metrics),
        ]);
      }
    }
    return built;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classeRows, expanded]);

  return (
    <div className="w-full flex flex-col flex-1">
      <TableGeneric
        headers={headers}
        rows={rows}
        title="Estoque de Salários por Classe"
        color={color}
        maxHeight={700}
        enablePagination={false}
      />
    </div>
  );
};

export default SalariosTabela;
