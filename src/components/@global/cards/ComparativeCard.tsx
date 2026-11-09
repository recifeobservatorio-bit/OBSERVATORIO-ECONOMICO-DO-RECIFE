import { tooltipFormatter } from "@/utils/formatters/@global/graphFormatter";
import { formatNormalnumber } from "@/utils/formatters/@global/numberFormatter";

import CardEmojiBadge from "./CardEmojiBadge";

const ComparativeCard = ({
  title = "",
  data,
  data2,
  comparative,
  year,
  color,
  position = false,
  lowerIsBetter = false,
  compare = ['Recife', 'Recife'],
  icon,
}: {
  title: string;
  data: number | string;
  data2: number | string
  comparative: string
  year: string;
  color: string;
  position?: boolean
  // Métricas em que número maior é pior (demitidos, tempo, posição no ranking): inverte as cores do selo.
  lowerIsBetter?: boolean
  compare: string[]
  icon?: React.ReactNode
}) => {
  // Recife sempre vem primeiro na comparação: quando ele chega como o segundo
  // lado (o "selecionado" da página), troca a ordem dos nomes, dos valores e
  // do texto "A x B" montado pelos cards.
  const isRecife = (name: string) => /recife/i.test(name ?? "");
  const swap = isRecife(compare[1]) && !isRecife(compare[0]);
  const [toCompare, comp] = swap ? [compare[1], compare[0]] : compare;
  if (swap) {
    [data, data2] = [data2, data];
    if (comparative === `${compare[0]} x ${compare[1]}`) comparative = `${toCompare} x ${comp}`;
  }

  // Quanto o lado principal (Recife, em destaque) está acima/abaixo da outra
  // cidade, tomando a outra cidade como base: (principal - outra) / outra.
  const percentComparative = (other: number, main: number): {
    text: string
    // Frase completa no balão do mouse (o selo é curto pra não quebrar linha).
    hint?: string
    color: string
  } | null => {
    const green = 'text-green-700 dark:text-green-400'
    const red = 'text-red-700 dark:text-red-500'

    // Posição em ranking (1º = melhor): diferença em posições, não em %.
    if (position) {
      if (!isFinite(other) || !isFinite(main)) return null;
      const ahead = Math.round(other - main);
      const n = Math.abs(ahead);
      if (ahead === 0) return { text: '= posição', hint: `Mesma posição de ${comp}`, color: 'text-gray-600 dark:text-gray-300' };
      return {
        text: `${ahead > 0 ? '▲' : '▼'} ${n} ${n === 1 ? 'posição' : 'posições'}`,
        hint: `${toCompare}: ${n} ${n === 1 ? 'posição' : 'posições'} ${ahead > 0 ? 'à frente de' : 'atrás de'} ${comp}`,
        color: ahead > 0 ? green : red
      }
    }

    if (!other || !isFinite(other) || !isFinite(main)) return null;

    const percentageDifference = ((main - other) / Math.abs(other)) * 100;
    // Padrão brasileiro: vírgula decimal e ponto de milhar (18.606,70%).
    const pct = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (percentageDifference >= 0) {
      return {
        text: `+ ${pct(percentageDifference)}% vs ${comp}`,
        color: lowerIsBetter ? red : green
      }
    }
    return {
      text: `- ${pct(Math.abs(percentageDifference))}% vs ${comp}`,
      color: lowerIsBetter ? green : red
    }
  }

  const percentage = percentComparative(+data, +data2)

  return (
    // Mesmo formato de KPI do Card: título na faixa azul-marinho.
    <div className="bi-kpi flex-1 min-w-[250px] text-black dark:text-white h-full">
      <h2 className="bi-kpi-title">{title}</h2>
      <div className="px-4 pt-2 pb-3 flex flex-col flex-1">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs font-light text-gray-600 dark:text-gray-400">
              {year}
          </span>
         {toCompare !== comp && percentage && <span title={percentage.hint ?? `${toCompare} em relação a ${comp}`} style={{ borderColor: `${color}` }} className={`whitespace-nowrap shrink-0 border bg-white dark:bg-[#0C1A28] rounded-full font-semibold text-[12px] px-2 ${percentage.color} py-1`}>{percentage.text}</span>}
        </div>
        {/* Nomes das cidades primeiro, valores embaixo (na mesma ordem). */}
        <div className="flex flex-col justify-between flex-1 ">
          <span className="opacity-85 text-sm mt-2">{comparative}</span>
          <div className="flex justify-between items-center gap-3 mt-1 mb-1">
            <p className="text-2xl font-semibold">{tooltipFormatter(+data2)}<span className="opacity-85 text-sm">{ toCompare !== comp && ` x ${tooltipFormatter(+data)}` }</span></p>
            <CardEmojiBadge title={title} icon={icon} color={color} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeCard;
