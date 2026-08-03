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
const cache: Record<string, any[]> = {};
const fetching: Record<string, Promise<any[]>> = {};

export class RaisData {
  constructor(private year: string) {}

  async fetchProcessedDataRais(): Promise<any[]> {
    const year = this.year;
    if (cache[year]) return cache[year];
    if (fetching[year]) return fetching[year];

    fetching[year] = (async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/rais_${year}.parquet`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
      const rows = normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
      cache[year] = rows;
      return rows;
    })();

    return fetching[year];
  }

  clearCache(): void {
    for (const k of Object.keys(cache)) delete cache[k];
    for (const k of Object.keys(fetching)) delete fetching[k];
  }
}
