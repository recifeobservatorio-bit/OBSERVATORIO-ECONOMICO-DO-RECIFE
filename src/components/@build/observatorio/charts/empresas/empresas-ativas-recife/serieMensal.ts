import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";

// Série mensal contínua (todos os anos) de empresas ativas no Recife, com a
// variação sobre o mês anterior — como "Quantidade total mensal" e "Variação
// mensal" do Panorama das Empresas Ativas no Power BI. Estoque não se soma
// entre meses: cada ponto é o total do mês.
export const serieMensalEmpresasAtivas = (rows: any[] = []) => {
  const byKey = new Map<number, { label: string; empresas: number }>();
  rows.forEach((r) => {
    const ano = Number(r["Ano"]);
    const mes = monthOptionIndex(String(r["Mês"] ?? r["mes"] ?? r["Mes"]));
    if (!ano || !(mes >= 1 && mes <= 12)) return;
    const key = ano * 100 + mes;
    const cur = byKey.get(key) ?? { label: `${monthShortName(mes)}/${ano}`, empresas: 0 };
    cur.empresas += Number(r["Empresas Ativas"]) || 0;
    byKey.set(key, cur);
  });
  const serie = Array.from(byKey.entries()).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
  return serie.map((p, i) => {
    const prev = i > 0 ? serie[i - 1].empresas : 0;
    return { ...p, variacao: prev ? Math.round(((p.empresas - prev) / prev) * 10000) / 100 : null };
  });
};
