import { dedupeProducoes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";
import { tooltipFormatter } from "@/utils/formatters/@global/graphFormatter";

import CardEmojiBadge from "@/components/@global/cards/CardEmojiBadge";

// Card customizado (não o Card genérico) porque precisa da linha extra "Média por Produção",
// que o relatório de referência mostra junto do total de pessoas envolvidas.
const PessoasEnvolvidas = ({ data = [], local = "Recife", year, color }: any) => {
  const producoes = dedupeProducoes(data);
  const total = producoes.reduce((acc: number, item: any) => acc + (item["QTD. DE PESSOAS NA EQUIPE"] || 0), 0);
  const media = producoes.length ? total / producoes.length : 0;

  return (
    <div className="bi-kpi shrink-0 w-full sm:w-auto" style={{ minWidth: "310px" }}>
      <h2 className="bi-kpi-title">Pessoas Envolvidas</h2>
      <div className="flex-1 flex justify-between items-center gap-3 px-4 pt-3">
        <p className="text-4xl font-semibold text-gray-900 dark:text-gray-100 w-fit">{tooltipFormatter(total)}</p>
        <CardEmojiBadge title="Pessoas Envolvidas" color={color} />
      </div>
      <p className="px-4 text-sm text-gray-600 dark:text-gray-300 mt-1">Média por Produção: {tooltipFormatter(Math.round(media))}</p>
      <span className="px-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
        {local ? `${local} -` : ""} {year}
      </span>
    </div>
  );
};

export default PessoasEnvolvidas;
