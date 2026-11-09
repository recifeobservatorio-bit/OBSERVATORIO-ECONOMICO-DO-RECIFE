import { AdditionalFilter } from "@/@types/observatorio/shared";

import { normalizeText, resolveFilterTarget } from "./resolveFilterTarget";

/**
 * Retratos dos gráficos de categoria (barra, coluna, pizza…) tirados enquanto a dimensão deles
 * não tinha seleção — ou seja, com TODAS as categorias. Depois de um clique o filtro real é
 * aplicado e os dados voltam só com a categoria escolhida; o retrato deixa o gráfico continuar
 * completo, com a escolhida em evidência. As categorias não escolhidas mostram o valor de antes do
 * clique (referência); só vale dentro do mesmo ano, senão nem as categorias seriam as mesmas.
 */
type Snapshot = { year: string | null; data: unknown[] };

const snapshots = new Map<string, Snapshot>();

export const getChartSnapshot = (key: string) => snapshots.get(key);
export const setChartSnapshot = (key: string, snapshot: Snapshot) => void snapshots.set(key, snapshot);
export const clearChartSnapshots = () => snapshots.clear();

const DIMENSION_SAMPLE = 40;

/**
 * A qual filtro da página as categorias deste gráfico pertencem? Resolve as primeiras categorias
 * (mesma regra do clique) e exige que pelo menos metade caia no mesmo filtro.
 */
export function detectChartDimension(
  categories: string[],
  additionalFilters: AdditionalFilter[] | undefined,
  title?: string
): AdditionalFilter | null {
  if (!additionalFilters?.length) return null;
  const sample = categories.filter((c) => c.trim() !== "").slice(0, DIMENSION_SAMPLE);
  if (!sample.length) return null;

  const tally = new Map<string, { filter: AdditionalFilter; count: number }>();
  for (const category of sample) {
    const target = resolveFilterTarget(category, additionalFilters, { hint: title });
    if (!target) continue;
    const entry = tally.get(target.filter.label) ?? { filter: target.filter, count: 0 };
    entry.count += 1;
    tally.set(target.filter.label, entry);
  }

  let best: { filter: AdditionalFilter; count: number } | null = null;
  tally.forEach((entry) => {
    if (!best || entry.count > best.count) best = entry;
  });
  const winner = best as { filter: AdditionalFilter; count: number } | null;
  return winner && winner.count >= Math.ceil(sample.length / 2) ? winner.filter : null;
}

/**
 * Categorias do retrato (todas, na ordem original) com os valores atuais das que ainda existem
 * nos dados de hoje — as escolhidas — e os valores do retrato pras demais.
 */
export function mergeWithSnapshot<T>(snapshot: T[], current: T[], getCategory: (entry: T) => unknown): T[] {
  const currentByCategory = new Map(current.map((entry) => [normalizeText(getCategory(entry)), entry]));
  const seen = new Set<string>();

  const merged = snapshot.map((entry) => {
    const key = normalizeText(getCategory(entry));
    seen.add(key);
    return currentByCategory.get(key) ?? entry;
  });
  current.forEach((entry) => {
    if (!seen.has(normalizeText(getCategory(entry)))) merged.push(entry);
  });
  return merged;
}
