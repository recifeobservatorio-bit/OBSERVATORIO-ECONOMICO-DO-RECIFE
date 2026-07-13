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

const geralFetcher = makeFlatFetcher("ranking_geral.parquet");
const dimensaoFetcher = makeFlatFetcher("ranking_dimensao.parquet");
const indicadorFetcher = makeFlatFetcher("ranking_indicador.parquet");
const pilaresFetcher = makeFlatFetcher("ranking_pilares.parquet");

function filterByYear(rows: any[], year: string): any[] {
  return rows.filter((r) => String(r.Ano) === String(year));
}

export class RankingData {
  constructor(private year: string) {}

  async fetchProcessedGeralData(): Promise<any[]> {
    return filterByYear(await geralFetcher.fetchAll(), this.year);
  }

  async fetchProcessedDimensaoData(): Promise<any[]> {
    return filterByYear(await dimensaoFetcher.fetchAll(), this.year);
  }

  async fetchProcessedIndicadorData(): Promise<any[]> {
    return filterByYear(await indicadorFetcher.fetchAll(), this.year);
  }

  async fetchProcessedPilaresData(): Promise<any[]> {
    return filterByYear(await pilaresFetcher.fetchAll(), this.year);
  }

  clearCache(): void {
    geralFetcher.clearCache();
    dimensaoFetcher.clearCache();
    indicadorFetcher.clearCache();
    pilaresFetcher.clearCache();
  }
}
