import { readParquetFromBuffer } from "@/@api/config/parquetReader";

// rfc.parquet (ver scripts/convert_rfc.js no repo admin-backend): uma linha por par
// produção+locação (uma produção com N locações autorizadas aparece N vezes, mesmo ID
// repetido). As 3 abas RFC do relatório de referência (Produções/Locações/Painel) derivam todas
// dessa mesma tabela client-side — Painel é a tabela crua, Produções agrupa por ID, Locações
// agrupa por "LOCAÇÃO AUTORIZADA".
const PARQUET_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/rfc.parquet`;

let _cache: any[] | null = null;
let _fetching: Promise<any[] | null> | null = null;

export async function fetchRfcRaw(): Promise<any[] | null> {
  if (_cache) return _cache;
  if (_fetching) return _fetching;

  _fetching = (async () => {
    try {
      const res = await fetch(PARQUET_URL);
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      const rawRows: any[] = await readParquetFromBuffer(buf);
      const rows = rawRows.map((row) => {
        const normalized: any = {};
        for (const key of Object.keys(row)) {
          const v = row[key];
          normalized[key] = typeof v === "bigint" ? Number(v) : v;
        }
        return normalized;
      });
      _cache = rows;
      return rows;
    } catch {
      return null;
    } finally {
      if (!_cache) _fetching = null;
    }
  })();

  return _fetching;
}

export function clearRfcCache() {
  _cache = null;
  _fetching = null;
}
