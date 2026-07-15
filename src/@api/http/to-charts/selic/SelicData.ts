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

const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/selic.parquet`;
let cache: any[] | null = null;
let fetching: Promise<any[]> | null = null;

export class SelicData {
  async fetchProcessedData(): Promise<any[]> {
    if (cache) return cache;
    if (fetching) return fetching;
    fetching = (async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
      const rows = normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
      rows.sort((a, b) => new Date(a.Data).getTime() - new Date(b.Data).getTime());
      cache = rows;
      return rows;
    })();
    return fetching;
  }

  clearCache(): void {
    cache = null;
    fetching = null;
  }
}
