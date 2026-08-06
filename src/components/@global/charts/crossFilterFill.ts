import { ChartSelection } from "@/context/ChartSelectionContext";

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
