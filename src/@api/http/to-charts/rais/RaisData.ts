import { readParquetFromBuffer } from "@/@api/config/parquetReader";

function normalizeBigInt(rows: any[]) {
  return rows.map((row) => {
    const normalized: any = {};
    for (const key of Object.keys(row)) {
      const v = row[key];
      normalized[key] = typeof v === "bigint" ? Number(v) : v;
    }
    return normalized;
  });
}

// Um arquivo .parquet por ano (rais_2021.parquet..rais_2025.parquet, ~900k linhas cada) em vez
// de um único flat parquet — RAIS é dado bruto por vínculo, não dá pra pré-agregar como outros
// módulos (raisDataService.ts precisa das linhas individuais pra filtrar/agrupar sob demanda),
// e todos os anos combinados (~4,6M linhas) seriam grandes demais pra buscar de uma vez.
const cache: Record<string, any[] | undefined> = {};
const fetching: Record<string, Promise<any[]> | undefined> = {};

// RAIS não tem um dataset "todos os anos" pra inspecionar (ver comentário acima) — pra saber
// quais anos existem sem editar código quando um rais_<ano>.parquet novo é publicado, sondamos
// (HEAD, sem baixar o arquivo) os anos seguintes ao maior já conhecido, parando na primeira
// falha. Resultado cacheado uma vez por sessão (não sonda de novo a cada fetch).
const KNOWN_YEARS = ["2021", "2022", "2023", "2024", "2025"];
const MAX_YEARS_TO_PROBE_AHEAD = 5;
let probedYearsCache: string[] | null = null;
let probedYearsPromise: Promise<string[]> | null = null;

async function probeAvailableYears(): Promise<string[]> {
  if (probedYearsCache) return probedYearsCache;
  if (probedYearsPromise) return probedYearsPromise;

  probedYearsPromise = (async () => {
    const years = [...KNOWN_YEARS];
    let nextYear = Math.max(...years.map(Number)) + 1;
    for (let i = 0; i < MAX_YEARS_TO_PROBE_AHEAD; i++) {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/rais_${nextYear}.parquet`;
        const res = await fetch(url, { method: "HEAD" });
        if (!res.ok) break;
        years.push(String(nextYear));
        nextYear++;
      } catch {
        break;
      }
    }
    probedYearsCache = years;
    return years;
  })();
  return probedYearsPromise;
}

export class RaisData {
  constructor(private year: string) {}

  static probeAvailableYears(): Promise<string[]> {
    return probeAvailableYears();
  }

  async fetchProcessedDataRais(): Promise<any[]> {
    const year = this.year;
    const cached = cache[year];
    if (cached) return cached;

    const inFlight = fetching[year];
    if (inFlight) return inFlight;

    const promise = (async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/rais_${year}.parquet`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
      const rows = normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
      cache[year] = rows;
      return rows;
    })();
    fetching[year] = promise;

    return promise;
  }

  clearCache(): void {
    for (const k of Object.keys(cache)) delete cache[k];
    for (const k of Object.keys(fetching)) delete fetching[k];
  }
}
