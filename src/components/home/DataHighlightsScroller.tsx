import React from "react";

interface Highlight {
  title: string;
  stat: string;
  description: string;
}

const highlights: Highlight[] = [
  {
    title: "Combustível mais barato",
    stat: "-0,80%",
    description: "Gasolina e etanol ficaram mais baratos em maio e seguraram a inflação do Recife.",
  },
  {
    title: "Mais gente com carteira assinada",
    stat: "561.638",
    description: "O maior número de empregos formais já registrado na cidade.",
  },
  {
    title: "Novos negócios todo dia",
    stat: "7.981",
    description: "Empresas abertas a mais que fechadas em 2026, com o registro saindo em 5 horas.",
  },
  {
    title: "A economia da cidade girando",
    stat: "R$ 26,8 bi",
    description: "Movimentados pelas empresas recifenses de janeiro a maio.",
  },
  {
    title: "O Recife vendendo para o mundo",
    stat: "+57,3%",
    description: "Crescimento das exportações em 2026, com produtos chegando a 28 países.",
  },
  {
    title: "O maior aeroporto do Nordeste",
    stat: "4,27 milhões",
    description: "Passageiros passaram pelo Recife de janeiro a maio, 6,1% a mais que em 2025.",
  },
  {
    title: "Serviços em alta",
    stat: "R$ 705,4 milhões",
    description: "Arrecadação do ISSQN no ano, crescimento de 10,9%.",
  },
];

function HighlightCard({ highlight }: { highlight: Highlight }) {
  return (
    <div className="flex-shrink-0 w-[300px] mx-4 bg-white dark:bg-[#142b42] rounded-lg shadow-lg p-6">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
        {highlight.title}
      </p>
      <p className="text-3xl font-bold text-[#0155AE] dark:text-[#EC6625] mb-2">
        {highlight.stat}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {highlight.description}
      </p>
    </div>
  );
}

function DataHighlightsScroller() {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-[#27384b] dark:to-[#0C1B2B] py-12">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white px-6">
        Recife em Números
      </h2>

      <div className="highlights-scroller-viewport">
        <div className="highlights-scroller-track">
          {[...highlights, ...highlights].map((highlight, index) => (
            <HighlightCard key={index} highlight={highlight} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataHighlightsScroller;
