import { readParquetFromBuffer } from "@/@api/config/parquetReader";
import { ProcessedDataPib } from "@/@types/observatorio/@data/ProcessedDataPib";

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

function makeFlatFetcher(fileName: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/${fileName}`;
  let cache: any[] | null = null;
  let fetching: Promise<any[]> | null = null;

  return {
    async fetchAll(): Promise<any[]> {
      if (cache) return cache;
      if (fetching) return fetching;
      fetching = (async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
        const rows = normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
        cache = rows;
        return rows;
      })();
      return fetching;
    },
    clearCache() {
      cache = null;
      fetching = null;
    },
  };
}

// Dados anuais de PIB dos municípios (2010-2023), sem filtro de ano na busca —
// o filtro por ano é aplicado depois pelo PibDataService.
const pibFetcher = makeFlatFetcher("pib.parquet");

export class PibData {
  constructor(private year: string) {}

  async fetchProcessedData(): Promise<ProcessedDataPib[]> {
    return pibFetcher.fetchAll();
  }

  async fetchProcessedDataByYear(year: string): Promise<ProcessedDataPib[]> {
    return pibFetcher.fetchAll();
  }

  clearCache(): void {
    pibFetcher.clearCache();
  }
}
