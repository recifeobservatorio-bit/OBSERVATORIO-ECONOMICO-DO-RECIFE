import { readParquetFromBuffer } from "@/@api/config/parquetReader";
import { IpcaGeralHeaders, IpcaGrupoHeaders, IpcaTabelaHeaders } from "@/@types/observatorio/@fetch/ipca";

const GERAL_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/ipca_indices_geral.parquet`;
const GRUPOS_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/ipca_grupos.parquet`;
const TABELAS_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/ipca_tabelas.parquet`;

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

async function fetchParquet(url: string): Promise<any[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ao buscar parquet: ${res.status}`);
  return normalizeBigInt(await readParquetFromBuffer(await res.arrayBuffer()));
}

let _geralCache: IpcaGeralHeaders[] | null = null;
let _geralFetching: Promise<IpcaGeralHeaders[]> | null = null;

let _gruposCache: IpcaGrupoHeaders[] | null = null;
let _gruposFetching: Promise<IpcaGrupoHeaders[]> | null = null;

let _tabelasCache: IpcaTabelaHeaders[] | null = null;
let _tabelasFetching: Promise<IpcaTabelaHeaders[]> | null = null;

export class IpcaData {
  // year kept for API-compat with callers, but the parquet fetch is year-agnostic —
  // filtering by year now happens client-side in ipcaDataService.ts.
  constructor(private year: string) {}

  async fetchProcessedGeralData(): Promise<IpcaGeralHeaders[]> {
    if (_geralCache) return _geralCache;
    if (_geralFetching) return _geralFetching;
    _geralFetching = fetchParquet(GERAL_URL).then((rows) => {
      const mapped = rows.map((r) => ({
        Ano: r.Ano,
        MÊS: r.Mes,
        Capital: r.Capital,
        "IPCA - Variação mensal": r["IPCA - Variação mensal(%)"],
        "IPCA - Variação acumulado no ano": r["IPCA - Variação acumulado no ano(%)"],
        "IPCA - Variação acumulada em 12 meses": r["IPCA - Variação acumulada nos 12 meses(%)"],
      }));
      _geralCache = mapped;
      return mapped;
    });
    return _geralFetching;
  }

  async fetchProcessedGruposData(): Promise<IpcaGrupoHeaders[]> {
    if (_gruposCache) return _gruposCache;
    if (_gruposFetching) return _gruposFetching;
    _gruposFetching = fetchParquet(GRUPOS_URL).then((rows) => {
      const mapped = rows.map((r) => ({
        ANO: r.Ano,
        MÊS: r.Mes,
        Capital: r.Capital,
        Grupo: r.Grupo,
        Subgrupo: r.Subgrupo,
        Item: r.Item,
        SubItem: r.SubItem,
        Indice: r.Indice,
      }));
      _gruposCache = mapped;
      return mapped;
    });
    return _gruposFetching;
  }

  async fetchProcessedTabelasData(): Promise<IpcaTabelaHeaders[]> {
    if (_tabelasCache) return _tabelasCache;
    if (_tabelasFetching) return _tabelasFetching;
    _tabelasFetching = fetchParquet(TABELAS_URL).then((rows) => {
      const mapped = rows.map((r) => ({
        Ano: r.Ano,
        MÊS: r.Mes,
        Grupo: r.Grupo,
        Capital: r.Capital,
        Acumulado: r.Acumulado,
        Mensal: r.Mensal,
        Peso: r.Peso,
      }));
      _tabelasCache = mapped;
      return mapped;
    });
    return _tabelasFetching;
  }

  clearCache(): void {
    _geralCache = null;
    _geralFetching = null;
    _gruposCache = null;
    _gruposFetching = null;
    _tabelasCache = null;
    _tabelasFetching = null;
  }
}
