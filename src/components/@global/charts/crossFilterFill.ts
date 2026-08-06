import { ChartSelection } from "@/context/ChartSelectionContext";

export const CROSS_FILTER_ACCENT = "#EC6625";
export const CROSS_FILTER_DIM_COLOR = "var(--chart-dim-color)";

const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();

export const isSameCategory = (entryValue: unknown, selectedValue: string) =>
  normalize(entryValue) !== "" && normalize(entryValue) === normalize(selectedValue);

/**
 * Resolve a cor de uma barra/fatia/célula considerando, nesta ordem:
 * 1. Se este gráfico foi a origem da seleção atual, o cross-filter é ignorado
 *    (mantém o comportamento estático de sempre: highlight fixo do próprio componente, ou cor normal).
 * 2. Se há uma seleção ativa vinda de outro gráfico, destaca quem tem a mesma categoria e esmaece o resto.
 * 3. Sem seleção ativa em lugar nenhum, comportamento estático de sempre.
 */
export function resolveCrossFilterFill({
  myId,
  selection,
  categoryValue,
  defaultFill,
  isStaticHighlighted,
  staticHighlightFill,
}: {
  myId: string;
  selection: ChartSelection;
  categoryValue: unknown;
  defaultFill: string;
  isStaticHighlighted: boolean;
  staticHighlightFill?: string;
}): string {
  const isCrossFilterActive = selection !== null && selection.sourceId !== myId;

  if (!isCrossFilterActive) {
    return isStaticHighlighted ? (staticHighlightFill ?? defaultFill) : defaultFill;
  }

  return isSameCategory(categoryValue, selection!.value)
    ? (staticHighlightFill ?? CROSS_FILTER_ACCENT)
    : CROSS_FILTER_DIM_COLOR;
}
