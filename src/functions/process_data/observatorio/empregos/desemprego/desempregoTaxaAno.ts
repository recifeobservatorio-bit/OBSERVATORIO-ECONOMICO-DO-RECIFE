// Série trimestral da taxa de desemprego (todos os anos), em ordem cronológica.
// Antes o ano era cortado do rótulo ("1º trimestre 2024" → "1º trimestre") e as
// taxas de anos diferentes eram SOMADAS no mesmo trimestre. Taxa não se soma:
// com mais de uma capital no filtro, o ponto é a média delas.
// Taxa 0 = trimestre sem divulgação (o IBGE suspendeu a PNAD por capital do
// 2º tri/2020 ao 1º tri/2022, e o arquivo traz 0 nas 27 capitais) — vira
// "sem dado" (null), senão a linha despencava a 0% na pandemia.
const quarterOf = (row: any) => +String(row["Trimestre"]).split("º")[0];

const averageByQuarter = (rows: any[]) => {
  const acc = new Map<string, { ano: number; tri: number; sum: number; n: number }>();
  for (const row of rows) {
    const ano = Number(row["Ano"]);
    const tri = quarterOf(row);
    if (!ano || !tri) continue;
    const key = `${ano}-${tri}`;
    const cur = acc.get(key) ?? { ano, tri, sum: 0, n: 0 };
    const taxa = Number(row["Taxa"]);
    if (row["Taxa"] != null && Number.isFinite(taxa) && taxa > 0) {
      cur.sum += taxa;
      cur.n += 1;
    }
    acc.set(key, cur);
  }
  return acc;
};

const mean = (entry?: { sum: number; n: number }) => (entry && entry.n ? round1(entry.sum / entry.n) : null);

const round1 = (n: number) => Math.round(n * 10) / 10;

export const processDesempregoTaxaAno = (capitalRows: any[] = [], brasilRows: any[] = []) => {
  const capital = averageByQuarter(capitalRows);
  const brasil = averageByQuarter(brasilRows);

  return Array.from(capital.values())
    .sort((a, b) => a.ano - b.ano || a.tri - b.tri)
    .map((entry) => ({
      label: `${entry.tri}º tri/${entry.ano}`,
      value: mean(entry),
      brasil: mean(brasil.get(`${entry.ano}-${entry.tri}`)),
    }));
};

// Liga as pontas de cada vão sem dado (null) da série `key` numa série
// auxiliar `bridgeKey` (desenhar com connectNulls: false), tracejada: a linha não fica quebrada, mas
// fica claro que ali não há dado (taxa por capital sem divulgação na base).
export const withGapBridge = <T extends Record<string, any>>(rows: T[], key: string, bridgeKey: string): T[] => {
  const out = rows.map((r) => ({ ...r, [bridgeKey]: null })) as any[];
  let lastIdx = -1;
  for (let i = 0; i < out.length; i++) {
    if (out[i][key] == null) continue;
    if (lastIdx >= 0 && i - lastIdx > 1) {
      // Reta entre as pontas (só para desenhar; o tooltip não mostra a ponte).
      const a = Number(out[lastIdx][key]);
      const b = Number(out[i][key]);
      for (let j = lastIdx; j <= i; j++) {
        out[j][bridgeKey] = Math.round((a + ((b - a) * (j - lastIdx)) / (i - lastIdx)) * 10) / 10;
      }
    }
    lastIdx = i;
  }
  return out;
};
