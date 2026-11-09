import { AdditionalFilter } from "@/@types/observatorio/shared";
import { formatBairroLabel } from "@/utils/formatters/@global/formatBairroLabel";

import { isMonthFilterLabel, monthOptionIndex } from "./monthFilterHelpers";

export type FilterTarget = {
  filter: AdditionalFilter;
  /** Valor cru, exatamente como está em filter.options (é isso que o filtro compara com os dados). */
  option: string;
};

const DIACRITICS_REGEX = /[̀-ͯ]/g;

export const normalizeText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim();

const isValidMonth = (value: string) => monthOptionIndex(value) <= 12;

/**
 * Índices por lista de opções (filtros como LOGRADOURO têm dezenas de milhares de opções e o
 * resolvedor roda a cada render dos gráficos): montados uma vez por array de `options`.
 */
type OptionIndex = {
  exact: Set<string>;
  normalized: Map<string, string[]>;
  /** rótulo exibido → opções crua (só difere da opção em bairros, ex.: "Bairro do Recife" → "Recife") */
  bairroAlias: Map<string, string[]>;
};

const indexCache = new WeakMap<string[], OptionIndex>();

function indexOf(options: string[]): OptionIndex {
  let index = indexCache.get(options);
  if (index) return index;
  index = { exact: new Set(options), normalized: new Map(), bairroAlias: new Map() };
  for (const option of options) {
    const key = normalizeText(option);
    const list = index.normalized.get(key);
    if (list) list.push(option);
    else index.normalized.set(key, [option]);

    const shown = formatBairroLabel(option);
    if (shown !== option) {
      const aliases = index.bairroAlias.get(shown);
      if (aliases) aliases.push(option);
      else index.bairroAlias.set(shown, [option]);
    }
  }
  indexCache.set(options, index);
  return index;
}

/** Nome do filtro como o usuário lê ("nome_bairro" → "bairro"), pra comparar com títulos de gráfico. */
const filterWords = (f: AdditionalFilter) =>
  [f.displayLabel, f.label]
    .filter((v): v is string => !!v)
    .map((v) => normalizeText(v).replace(/^nome[_ ]/, "").replace(/_/g, " "))
    .filter((v) => v.length >= 3);

/** Entre vários filtros candidatos, mantém os que aparecem no título do gráfico (ex.: "Empresas por Bairro"). */
function narrowByHint(found: FilterTarget[], hint: string | undefined): FilterTarget[] {
  if (!hint) return found;
  const text = normalizeText(hint);
  const narrowed = found.filter(({ filter }) => filterWords(filter).some((w) => text.includes(w)));
  return narrowed.length ? narrowed : found;
}

/** Opções do filtro que casam com o valor em cada camada, da mais estrita pra mais frouxa. */
const tiers: Array<(f: AdditionalFilter, value: string) => string[]> = [
  // 1. igualdade exata
  (f, value) => (indexOf(f.options).exact.has(value) ? [value] : []),
  // 2. equivalências conhecidas: mês por extenso/número, hash do filtro, rótulo de bairro
  (f, value) => {
    const found = new Set<string>();
    if (isMonthFilterLabel(f.label) && isValidMonth(value)) {
      for (const option of f.options) {
        if (isValidMonth(option) && monthOptionIndex(option) === monthOptionIndex(value)) found.add(option);
      }
    }
    if (f.hash) {
      const exact = indexOf(f.options).exact;
      for (const key of Object.keys(f.hash)) {
        if (String(f.hash[key]) === value && exact.has(key)) found.add(key);
      }
    }
    // "Bairro do Recife" é só o rótulo exibido do bairro "Recife" — não vale pra filtro de município.
    if (/bairro/i.test(f.label)) indexOf(f.options).bairroAlias.get(value)?.forEach((o) => found.add(o));
    return [...found];
  },
  // 3. igualdade ignorando caixa e acento
  (f, value) => indexOf(f.options).normalized.get(normalizeText(value)) ?? [],
];

/**
 * Descobre qual filtro adicional (e qual opção dele) corresponde ao valor de categoria
 * clicado num gráfico. O rótulo mostrado no gráfico nem sempre é o valor cru do filtro
 * (ex.: "Bairro do Recife" x "Recife", "Maio" x "5"), então testa em camadas (ver `tiers`) e
 * para na primeira camada que achou alguma coisa.
 * Se a camada vencedora bater em mais de um filtro (ou mais de uma opção do mesmo filtro),
 * tenta desempatar pelo `hint` (título do gráfico); se continuar ambíguo, retorna null —
 * melhor não filtrar do que filtrar a dimensão errada.
 *
 * `filterLabel` (opcional) restringe a busca a um único filtro.
 */
export function resolveFilterTarget(
  value: string,
  additionalFilters: AdditionalFilter[] | undefined,
  opts: { filterLabel?: string; hint?: string } = {}
): FilterTarget | null {
  if (!additionalFilters?.length || !String(value ?? "").trim()) return null;

  const candidates = additionalFilters.filter(
    (f) => f.options?.length && (!opts.filterLabel || f.label === opts.filterLabel)
  );

  for (const matchOptions of tiers) {
    let found: FilterTarget[] = [];
    for (const filter of candidates) {
      for (const option of matchOptions(filter, value)) found.push({ filter, option });
    }
    if (found.length > 1) found = narrowByHint(found, opts.hint);
    if (found.length === 1) return found[0];
    if (found.length > 1) return null;
  }

  return null;
}
