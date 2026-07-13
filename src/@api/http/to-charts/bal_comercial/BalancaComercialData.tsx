import { readParquetFromBuffer } from "@/@api/config/parquetReader";
import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";

const PARQUET_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/balanca_comercial.parquet`;

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

let _cache: BalancaHeaders[] | null = null;
let _fetching: Promise<BalancaHeaders[]> | null = null;

async function fetchAll(): Promise<BalancaHeaders[]> {
  if (_cache) return _cache;
  if (_fetching) return _fetching;
  _fetching = (async () => {
    const res = await fetch(PARQUET_URL);
    if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
    const rows = normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
    _cache = rows;
    return rows;
  })();
  return _fetching;
}

export class BalancaComercialData {
  constructor(private year: string) {}

  async fetchProcessedData(): Promise<BalancaHeaders[]> {
    const rows = await fetchAll();
    return rows.filter((r) => String(r.Ano) === String(this.year));
  }

  clearCache(): void {
    _cache = null;
    _fetching = null;
  }
}
