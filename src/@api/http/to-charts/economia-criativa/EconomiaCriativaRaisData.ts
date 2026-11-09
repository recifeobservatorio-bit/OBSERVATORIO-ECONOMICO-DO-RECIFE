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

// Um arquivo .parquet por ano (rais_economia_criativa_2021.parquet..2025.parquet), mesma divisão
// por ano do RaisData.ts normal (ver esse arquivo pro porquê) — esses arquivos já vêm filtrados
// no backend pelos CNAEs de economia criativa (ver scripts/convert_economia_criativa.js no repo
// admin-backend), então aqui é só ler o parquet já pronto, sem filtro adicional de CNAE.
const cache: Record<string, any[] | undefined> = {};
const fetching: Record<string, Promise<any[]> | undefined> = {};

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
        const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/rais_economia_criativa_${nextYear}.parquet`;
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

export class EconomiaCriativaRaisData {
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
      const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/rais_economia_criativa_${year}.parquet`;
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
