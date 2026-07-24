import { readParquetFromBuffer } from "@/@api/config/parquetReader";
import { AenaCargasHeaders, AenaPassageirosHeaders, AnacGeralHeaders } from "@/@types/observatorio/@fetch/aeroporto";

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

const PT_LOWERCASE_CONNECTORS = new Set(["de", "do", "da", "dos", "das", "e"]);

// "FERNANDO DE NORONHA" -> "Fernando de Noronha". AnacEmbarqueDesembarque's text columns are
// all-caps in the source, but the frontend's default filter selections (e.g. AEROPORTO NOME:
// "Recife") and Aena's own data assume Title Case — mismatched casing means an exact-match
// filter silently matches zero rows instead of erroring.
function titleCasePt(s: unknown): unknown {
  if (s == null) return s;
  return String(s)
    .toLowerCase()
    .split(" ")
    .map((word, i) => (i > 0 && PT_LOWERCASE_CONNECTORS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function normalizeAnacText(rows: any[]) {
  return rows.map((row) => ({
    ...row,
    "AEROPORTO NOME": titleCasePt(row["AEROPORTO NOME"]),
    "AEROPORTO REGIÃO": titleCasePt(row["AEROPORTO REGIÃO"]),
    NATUREZA: titleCasePt(row.NATUREZA),
  }));
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

const anacFetcher = makeFlatFetcher("AnacEmbarqueDesembarque.parquet");
const aenaCargasFetcher = makeFlatFetcher("aena_cargas.parquet");
const aenaPassageirosFetcher = makeFlatFetcher("aena_passageiros.parquet");

let normalizedAnacCache: AnacGeralHeaders[] | null = null;
async function fetchNormalizedAnac(): Promise<AnacGeralHeaders[]> {
  if (normalizedAnacCache) return normalizedAnacCache;
  normalizedAnacCache = normalizeAnacText(await anacFetcher.fetchAll()) as AnacGeralHeaders[];
  return normalizedAnacCache;
}

function filterByYear(rows: any[], year: string, field: string): any[] {
  return rows.filter((r) => String(r[field]) === String(year));
}

export class AeroportoData {
  constructor(private year: string) {}

  async fetchProcessedData(): Promise<AnacGeralHeaders[]> {
    return filterByYear(await fetchNormalizedAnac(), this.year, "ANO");
  }

  async fetchProcessedAenaPassageirosData(): Promise<AenaPassageirosHeaders[]> {
    // aena_passageiros.parquet already has a "Mês" column (written with the accent by the
    // conversion script) — no remapping needed here.
    return filterByYear(await aenaPassageirosFetcher.fetchAll(), this.year, "Ano");
  }

  async fetchProcessedAenaCargasData(): Promise<AenaCargasHeaders[]> {
    return filterByYear(await aenaCargasFetcher.fetchAll(), this.year, "Ano");
  }

  clearCache(): void {
    anacFetcher.clearCache();
    normalizedAnacCache = null;
    aenaCargasFetcher.clearCache();
    aenaPassageirosFetcher.clearCache();
  }
}
