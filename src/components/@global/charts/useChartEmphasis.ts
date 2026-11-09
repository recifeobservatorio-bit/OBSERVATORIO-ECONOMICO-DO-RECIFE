import { useEffect, useMemo } from "react";

import { Filters } from "@/@types/observatorio/shared";
import {
  detectChartDimension,
  getChartSnapshot,
  mergeWithSnapshot,
  setChartSnapshot,
} from "@/utils/filters/@global/chartEmphasis";
import { resolveFilterTarget } from "@/utils/filters/@global/resolveFilterTarget";

/** Opacidade das categorias não escolhidas enquanto há uma escolhida em evidência. */
export const DIMMED_OPACITY = 0.3;

const toCategory = (value: unknown) => String(value ?? "");

/**
 * Deixa um gráfico de categorias (barra, coluna, pizza…) em modo "evidência": quando o filtro da
 * dimensão dele tem seleção, a(s) categoria(s) escolhida(s) ficam com opacidade cheia e as outras
 * esmaecidas — em vez de sumirem. O filtro real faz os dados voltarem só com as escolhidas, então
 * as demais categorias vêm de um retrato tirado antes da seleção (ver chartEmphasis.ts). Se o
 * retrato não vale (não existe ou é de outro ano), o gráfico mostra só as escolhidas, mas destacadas.
 *
 * Retorna `data` (a ser exibida) e `emphasisOpacity(entry)`, que é sempre 1 quando não há evidência.
 */
export function useChartEmphasis<T>({
  enabled,
  data,
  getCategory,
  title,
  filters,
}: {
  enabled: boolean;
  data: T[];
  getCategory: (entry: T) => unknown;
  title?: string;
  filters?: Filters;
}) {
  const list: T[] = Array.isArray(data) ? data : [];
  const additional = filters?.additionalFilters;

  // Impressão digital barata das categorias: evita reprocessar a cada render, já que `data`
  // costuma ser um array novo a cada render do pai.
  const dataKey = enabled ? `${list.length}|${list.slice(0, 40).map((e) => toCategory(getCategory(e))).join("¦")}` : "";

  const dimension = useMemo(
    () => (enabled ? detectChartDimension(list.map((e) => toCategory(getCategory(e))), additional, title) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, dataKey, additional, title]
  );

  const selectedKey = dimension?.selected?.join("¦") ?? "";
  const isSelectedCategory = useMemo(() => {
    const selected = new Set(dimension?.selected ?? []);
    const cache = new Map<string, boolean>();
    return (category: string) => {
      if (!dimension || selected.size === 0) return false;
      let result = cache.get(category);
      if (result === undefined) {
        const target = resolveFilterTarget(category, [dimension], { filterLabel: dimension.label, hint: title });
        result = !!target && selected.has(target.option);
        cache.set(category, result);
      }
      return result;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimension, selectedKey, title]);

  const hasSelection = !!dimension && (dimension.selected?.length ?? 0) > 0;
  const year = filters?.year ?? null;
  const snapshotKey = dimension && title ? `${title}|${dimension.label}` : null;

  // Sem seleção na dimensão, os dados atuais são a lista completa: guarda o retrato.
  useEffect(() => {
    if (enabled && snapshotKey && !hasSelection && list.length > 0) {
      setChartSnapshot(snapshotKey, { year, data: list });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, snapshotKey, year, hasSelection, data]);

  const hasUnselected = hasSelection && list.some((e) => !isSelectedCategory(toCategory(getCategory(e))));

  const merged = useMemo(() => {
    if (!enabled || !hasSelection || hasUnselected || !snapshotKey) return data;
    const snapshot = getChartSnapshot(snapshotKey);
    if (!snapshot || snapshot.year !== year) return data;
    return mergeWithSnapshot(snapshot.data as T[], list, getCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, hasSelection, hasUnselected, snapshotKey, year, data]);

  const mergedList: T[] = Array.isArray(merged) ? merged : [];
  const highlightActive = hasSelection && mergedList.some((e) => isSelectedCategory(toCategory(getCategory(e))));

  const emphasisOpacity = (entry: T) =>
    highlightActive && !isSelectedCategory(toCategory(getCategory(entry))) ? DIMMED_OPACITY : 1;

  return { data: merged, emphasisOpacity };
}
