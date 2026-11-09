import { useMemo } from "react";

import { ChartSelection, useChartSelection } from "@/context/ChartSelectionContext";
import { useOptionalDashboard } from "@/context/DashboardContext";

import { useChartEmphasis } from "./useChartEmphasis";

export const CROSS_FILTER_ACCENT = "#EC6625";

const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();

export const isSameCategory = (entryValue: unknown, selectedValue: string) =>
  normalize(entryValue) !== "" && normalize(entryValue) === normalize(selectedValue);

/**
 * Decide o que este gráfico deve exibir dado o estado de seleção compartilhado:
 * - Se este gráfico foi a origem da seleção (ou não há seleção nenhuma), mostra tudo, sem filtro.
 * - Se há seleção de outro gráfico e existe pelo menos uma categoria batendo, filtra para só essas.
 * - Se há seleção de outro gráfico mas nenhuma categoria bate (dimensão diferente, ex. bairro x mês),
 *   mostra tudo — esse gráfico simplesmente não é afetado por aquela seleção.
 */
export function resolveChartCrossFilter<T>({
  myId,
  selection,
  data,
  getCategory,
}: {
  myId: string;
  selection: ChartSelection;
  data: T[];
  getCategory: (entry: T) => unknown;
}): { active: boolean; visibleData: T[] } {
  const crossFilterRequested = selection !== null && selection.sourceId !== myId;
  if (!crossFilterRequested) return { active: false, visibleData: data };

  const matches = data.filter((entry) => isSameCategory(getCategory(entry), selection!.value));
  if (matches.length === 0) return { active: false, visibleData: data };

  return { active: true, visibleData: matches };
}

/**
 * Hook de conveniência: memoiza o resultado de resolveChartCrossFilter. Necessário porque
 * data.filter(...) cria um array novo a cada render — sem memoização, esse array novo vira
 * dependência instável em qualquer useEffect que dependa dele (ex.: paginação em gráficos
 * com scroll), causando loop infinito de setState.
 */
export function useChartCrossFilter<T>(
  chartId: string,
  data: T[],
  getCategory: (entry: T) => unknown,
  title?: string,
  options: { emphasis?: boolean } = {}
) {
  const { selection, select: selectLocal } = useChartSelection();
  const dashboard = useOptionalDashboard();
  const toggleFilterValue = dashboard?.toggleFilterValue;

  // Em gráficos de categoria (`emphasis`), a categoria escolhida no filtro da página fica em
  // evidência e as outras esmaecidas, em vez de sumirem.
  const { data: emphasizedData, emphasisOpacity } = useChartEmphasis({
    enabled: !!options.emphasis,
    data,
    getCategory,
    title,
    filters: dashboard?.filters,
  });

  const { active, visibleData } = useMemo(
    () => resolveChartCrossFilter({ myId: chartId, selection, data: emphasizedData, getCategory }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartId, selection, emphasizedData]
  );

  // Clicar numa categoria muda o filtro da própria página (Navbar) quando o valor pertence a algum
  // filtro dela. Se não pertence (dimensão sem filtro) ou é ambíguo, cai no cross-filter local antigo.
  const select = (sourceId: string, value: string) => {
    if (toggleFilterValue?.(value, { hint: title })) return;
    selectLocal(sourceId, value);
  };

  // Só filtro real, sem cross-filter local — para gráficos que nunca foram origem de seleção local
  // (linhas: clicar num mês/ano muda o filtro de mês/ano, e não faz nada se não houver filtro).
  const pickFilter = (value: string) => toggleFilterValue?.(value, { hint: title }) ?? false;

  return { crossFilterActive: active, visibleData, select, pickFilter, emphasisOpacity };
}

/**
 * Resolve a cor de uma barra/fatia/célula:
 * - Com cross-filter ativo pra este gráfico, todas as entradas restantes já batem com a seleção
 *   (foram filtradas antes), então usam a cor de destaque.
 * - Sem cross-filter ativo, comportamento estático de sempre (highlight fixo do componente, ou cor normal).
 */
export function resolveCrossFilterFill({
  crossFilterActive,
  defaultFill,
  isStaticHighlighted,
  staticHighlightFill,
}: {
  crossFilterActive: boolean;
  defaultFill: string;
  isStaticHighlighted: boolean;
  staticHighlightFill?: string;
}): string {
  if (crossFilterActive) {
    return staticHighlightFill ?? CROSS_FILTER_ACCENT;
  }
  return isStaticHighlighted ? (staticHighlightFill ?? defaultFill) : defaultFill;
}
