// rfc.parquet tem uma linha por par produção+locação (uma produção com N locações autorizadas
// aparece N vezes — ver convert_rfc.js no repo admin-backend). Atributos que pertencem à
// produção como um todo (Porte, Status, Cidade dos Produtores, Tipo de Obra, Qtd. de Pessoas na
// Equipe) precisam ser contados uma vez por produção, não uma vez por linha — esta função reduz
// pra uma linha por produção antes desses agregados.
//
// A chave é o NOME DA OBRA, não o ID: a planilha do RFC às vezes abre um ID novo pra cada pedido
// da mesma obra (ex.: "Turismo Prefeitura" tem 3 IDs). O relatório Power BI de referência conta
// obras distintas — por nome dá exatamente os números dele (52 produções, 1.126 pessoas, 51
// aprovadas + 1 desistência); por ID dava 57 / 1.289. Entre os IDs repetidos fica a linha com
// a maior equipe, que é como o relatório soma as pessoas envolvidas.
const PESSOAS = "QTD. DE PESSOAS NA EQUIPE";

const producaoKey = (row: any) => String(row["NOME DA OBRA ATENDIDA"] ?? row["ID"]).trim().toLowerCase();

export function dedupeProducoes(rows: any[]): any[] {
  const byKey = new Map<string, any>();
  for (const row of rows) {
    const key = producaoKey(row);
    const current = byKey.get(key);
    if (!current || (Number(row[PESSOAS]) || 0) > (Number(current[PESSOAS]) || 0)) {
      byKey.set(key, row);
    }
  }
  return Array.from(byKey.values());
}

// Uma linha por pedido (ID) — para métricas que pertencem a cada solicitação, e não à obra:
// diárias de filmagem, sets acompanhados e prazo de autorização. Uma obra com 3 pedidos teve 3
// filmagens diferentes; somar por obra subcontaria essas diárias.
export function dedupeSolicitacoes(rows: any[]): any[] {
  const seen = new Set<unknown>();
  const result: any[] = [];
  for (const row of rows) {
    if (seen.has(row["ID"])) continue;
    seen.add(row["ID"]);
    result.push(row);
  }
  return result;
}

// Uma linha por obra POR MÊS da DATA DA SOLICITAÇÃO — para as séries mensais. É como o
// relatório de referência monta "Pessoas envolvidas nas Produções" e "Produções" por mês: uma
// obra com pedidos em meses diferentes aparece em cada um desses meses (bate ponto a ponto:
// mai/25 108, jul/25 145, mar/26 165...), mas não é contada duas vezes no mesmo mês.
export const dataSolicitacao = (row: any): Date | null =>
  row["DATA DA SOLICITAÇÃO"] ? new Date(row["DATA DA SOLICITAÇÃO"]) : null;

export function dedupeProducoesPorMes(rows: any[]): any[] {
  const byKey = new Map<string, any>();
  for (const row of rows) {
    const date = dataSolicitacao(row);
    if (!date) continue;
    const key = `${producaoKey(row)}|${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const current = byKey.get(key);
    if (!current || (Number(row[PESSOAS]) || 0) > (Number(current[PESSOAS]) || 0)) {
      byKey.set(key, row);
    }
  }
  return Array.from(byKey.values());
}

// Conta obras distintas por valor de cada coluna — mesmo shape de geralAccFunction
// ({ coluna: { valor: contagem } }). O relatório de referência faz uma contagem distinta de
// obras por categoria: se a mesma obra tem pedidos com valores diferentes (ex.: um de Médio e
// outro de Baixo Impacto), ela conta nas duas categorias. Por isso Impacto soma 53 lá (29/18/6)
// mesmo com 52 produções — reduzir pra uma linha por obra antes de contar dava 29/17/6.
export function contarObrasPor(rows: any[], cols: string[]): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  for (const col of cols) {
    const obrasPorValor = new Map<string, Set<string>>();
    for (const row of rows) {
      const valor = row[col];
      if (valor == null || valor === "") continue;
      const key = String(valor);
      if (!obrasPorValor.has(key)) obrasPorValor.set(key, new Set());
      obrasPorValor.get(key)!.add(producaoKey(row));
    }
    result[col] = Object.fromEntries(Array.from(obrasPorValor, ([valor, obras]) => [valor, obras.size]));
  }
  return result;
}
