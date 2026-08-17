import { readParquetFromBuffer } from "@/@api/config/parquetReader";

const PARQUET_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/ITBI.parquet`;

let _cache: any[] | null = null;
let _fetching: Promise<any[]> | null = null;

export async function fetchItbiRaw(): Promise<any[]> {
  if (_cache) return _cache;
  if (_fetching) return _fetching;

  _fetching = (async () => {
    const res = await fetch(PARQUET_URL);
    if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
    const buf = await res.arrayBuffer();
    const rawRows: any[] = await readParquetFromBuffer(buf);
    // Normaliza campos BigInt (hyparquet retorna colunas Int64 como BigInt)
    const rows = rawRows.map((row) => {
      const normalized: any = {};
      for (const key of Object.keys(row)) {
        const v = row[key];
        normalized[key] = typeof v === "bigint" ? Number(v) : v;
      }
      return normalized;
    });
    // O parquet fonte tem ~1.8% de linhas duplicadas (mesmo imóvel/avaliação repetido com
    // "id" diferente — provável fan-out de join com partes envolvidas na transação no backend).
    // Deduplica por conteúdo (ignorando "id") pra "Total de Transações" bater com a contagem
    // real de transações (confirmado contra o PowerBI do Observatório: jun/2026 caiu de 1729
    // linhas brutas pra próximo do valor oficial de 1689).
    const seen = new Set<string>();
    const deduped = rows.filter((row) => {
      const { id, ...rest } = row;
      const key = JSON.stringify(rest);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    _cache = deduped;
    return deduped;
  })();

  return _fetching;
}

export function clearItbiCache() {
  _cache = null;
  _fetching = null;
}
