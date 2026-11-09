"use client";

import React from "react";

import BarChart from "@/components/@global/charts/BarChart";
import ChartGrabber from "@/components/@global/features/ChartGrabber";
import { dataSolicitacao, dedupeProducoesPorMes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";

// Cor fixa por Tipo de Obra na ordem alfabética, com a paleta padrão do Power BI começando
// pelo azul-claro — é exatamente como o relatório de referência colore esse gráfico
// (Ativação de Filme azul-claro, Curta-metragem azul-marinho, Documentário laranja...). A cor
// segue o tipo, não a posição na pilha, então não muda quando um filtro remove algum tipo.
const CORES_POWER_BI = ["#118DFF", "#12239E", "#E66C37", "#6B007B", "#E044A7", "#744EC2", "#D9B300", "#D64550", "#197278", "#1AAB40"];

// Barras empilhadas por mês (DATA DA SOLICITAÇÃO, cada obra uma vez por mês), uma cor por Tipo de Obra — reaproveita o
// BarChart genérico passando o mesmo stackId em cada série, já suportado pelo componente.
const ProducoesPorMes = ({ data = [], title = "Produções" }: any) => {
  const producoes = dedupeProducoesPorMes(data);

  const totalPorTipo: Record<string, number> = {};
  for (const p of producoes) {
    const tipo = p["TIPO DE OBRA"];
    if (!tipo) continue;
    totalPorTipo[tipo] = (totalPorTipo[tipo] || 0) + 1;
  }
  // Do mais frequente pro menos frequente — fica com a base da pilha (maior camada,
  // mais fácil de comparar entre meses) e o topo arredondado sempre visível na camada
  // que mais aparece, em vez de uma ordem alfabética arbitrária.
  const tipos = Object.keys(totalPorTipo).sort((a, b) => totalPorTipo[b] - totalPorTipo[a]);

  // Agrupado só por mês do calendário (Jan-Dez), somando todos os anos juntos — pedido do
  // cliente pra ver a sazonalidade das produções em vez de uma linha do tempo ano a ano.
  const porMes: Record<number, Record<string, number>> = {};
  for (const p of producoes) {
    const date = dataSolicitacao(p);
    const tipo = p["TIPO DE OBRA"];
    if (!date || !tipo) continue;
    const mes = date.getUTCMonth() + 1;
    if (!porMes[mes]) porMes[mes] = {};
    porMes[mes][tipo] = (porMes[mes][tipo] || 0) + 1;
  }

  const chartData = Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => ({
    label: monthShortName(mes),
    ...(porMes[mes] || {}),
  }));

  // Cantos arredondados só na última camada da pilha — arredondar todas (padrão do
  // BarChart genérico) cria vincos arredondados em cada divisa entre cores, o que fica
  // poluído com 9 camadas empilhadas.
  const tiposAlfabetico = [...tipos].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const colors = tipos.map((tipo) => CORES_POWER_BI[tiposAlfabetico.indexOf(tipo) % CORES_POWER_BI.length]);

  const bars = tipos.map((tipo, index) => ({
    dataKey: tipo,
    name: tipo,
    stackId: "producoes",
    radius: index === tipos.length - 1 ? ([6, 6, 0, 0] as [number, number, number, number]) : ([0, 0, 0, 0] as [number, number, number, number]),
  }));

  return (
    <div className="chart-wrapper">
      <ChartGrabber>
        <BarChart data={chartData} title={title} xKey="label" bars={bars} colors={colors} legendSquare />
      </ChartGrabber>
    </div>
  );
};

export default ProducoesPorMes;
