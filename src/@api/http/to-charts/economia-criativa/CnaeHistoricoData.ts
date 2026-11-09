import { readParquetFromBuffer } from "@/@api/config/parquetReader";

// dados_recife_cnae_historico.parquet: uma linha por estabelecimento (com atividade principal
// dentro dos CNAEs de economia criativa) por ano — já vem com "Grande Grupo" (Serviços/Indústria)
// e "Classe" (Publicidade, Arquitetura, Desenvolvimento de Softwares e Jogos Digitais...)
// pré-calculados pelo cliente, batendo exatamente com o relatório de referência (validado:
// contagem de linhas por Ano = 6.452/7.437/7.571 em 2023/2024/2025, split de Grande Grupo e
// Classe idênticos ao Power BI — ver conversa/memória do projeto). Substitui a aproximação
// anterior via Empresas.parquet (empresas_economia_criativa.parquet), que não batia os números
// exatos por não ter essas classificações prontas.
const PARQUET_URL = `${process.env.NEXT_PUBLIC_API_BASE_LOGIN}/data/dados_recife_cnae_historico.parquet`;

let _cache: any[] | null = null;
let _fetching: Promise<any[] | null> | null = null;

export async function fetchCnaeHistoricoRaw(): Promise<any[] | null> {
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

export function clearCnaeHistoricoCache() {
  _cache = null;
  _fetching = null;
}
