import { FC, ReactNode, useState } from "react";

import { BalancaHeaders } from "@/@types/observatorio/@fetch/balanca-comercial";
import TableGeneric from "@/components/@global/tables/TableGeneric";
import { processRowsPaisesByMunicipio } from "@/functions/process_data/observatorio/balanca-comercial/analitico/rowsCountrysByMunicipio";
import { formatNumber } from "@/utils/formatters/@global/numberFormatter";
import { percentFormatter } from "@/utils/formatters/@global/percentFormatter";
import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";
import { monthShortName } from "@/utils/formatters/@global/monthShortName";

type AggregatedRow = {
  PAÍS: string;
  PARTICIPAÇÃO: number;
  NEGOCIADO: number;
  IMPORTAÇÃO: number;
  EXPORTAÇÃO: number;
  ANO_ANTERIOR?: number;
  VAR_ANO?: number | null;
  MES_ANTERIOR?: number;
  VAR_MES?: number | null;
};

// Colunas extras como na matriz do Power BI: mesmo período do ano anterior e
// último mês x mês anterior (com um mês só filtrado, ficam iguais ao Power BI).
const somaPorPais = (rows: any[]) => {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(r["País"], (m.get(r["País"]) ?? 0) + (Number(r["Valor US$"]) || 0)));
  return m;
};
const variacao = (atual: number, antes: number) => (antes ? ((atual - antes) / antes) * 100 : null);
const fmtVar = (v: number | null | undefined) =>
  v == null ? "" : `${v >= 0 ? "▲" : "▼"} ${Math.abs(v).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

interface BalInfoProps {
  data: BalancaHeaders[];
  municipio: string;
  year: string;
  color?: string;
  selectCountry: (country: string) => void;
  monthRecent?: number;
  dataPast?: BalancaHeaders[];
  title?: string;
}

const BalInfo: FC<BalInfoProps> = ({
  data = [],
  municipio,
  year,
  color = "#000000",
  selectCountry,
  monthRecent,
  dataPast = [],
  title = `${municipio} (${monthRecent ? `${monthRecent} - ` : ""}${year}) - Negociações`,
}) => {
  const [ordenation, setOrdenation] = useState([{ index: 1, name: 'PARTICIPAÇÃO', ordenation: 0 }, { index: 2, name: 'NEGOCIADO', ordenation: 0 }, { index: 3, name: 'IMPORTAÇÃO', ordenation: 0 }, { index: 4, name: 'EXPORTAÇÃO', ordenation: 0 }, { index: 5, name: 'ANO_ANTERIOR', ordenation: 0 }, { index: 6, name: 'VAR_ANO', ordenation: 0 }, { index: 7, name: 'MES_ANTERIOR', ordenation: 0 }, { index: 8, name: 'VAR_MES', ordenation: 0 }]);

  const order = ordenation.find((item) => item.ordenation != 0)

  const aggregatedData = processRowsPaisesByMunicipio(
    data,
    municipio,
    year,
    monthRecent
  );

  // Meses do período (do município) e os recortes de comparação.
  const doMun = (data as any[]).filter((r) => r["Município"] === municipio);
  const meses = Array.from(new Set(doMun.map((r) => monthOptionIndex(String(r["Mês"]))))).filter((m) => m >= 1 && m <= 12).sort((a, b) => a - b);
  const ultimo = meses[meses.length - 1] ?? 0;
  const anoAnterior = somaPorPais((dataPast as any[]).filter((r) => r["Município"] === municipio && meses.includes(monthOptionIndex(String(r["Mês"])))));
  const ultimoMes = somaPorPais(doMun.filter((r) => monthOptionIndex(String(r["Mês"])) === ultimo));
  // Mês anterior ao último: no mesmo ano, ou dezembro do ano anterior se o último for janeiro.
  const mesAnteriorRows = ultimo > 1
    ? (data as any[]).filter((r) => r["Município"] === municipio && monthOptionIndex(String(r["Mês"])) === ultimo - 1)
    : (dataPast as any[]).filter((r) => r["Município"] === municipio && monthOptionIndex(String(r["Mês"])) === 12);
  const mesAnterior = somaPorPais(mesAnteriorRows);
  const nomeMesAnterior = ultimo ? monthShortName(ultimo > 1 ? ultimo - 1 : 12) : "";
  const nomeUltimo = ultimo ? monthShortName(ultimo) : "";

  Object.values(aggregatedData).forEach((row: any) => {
    const antes = anoAnterior.get(row.PAÍS) ?? 0;
    row.ANO_ANTERIOR = antes;
    row.VAR_ANO = variacao(row.NEGOCIADO, antes);
    const mesAnt = mesAnterior.get(row.PAÍS) ?? 0;
    row.MES_ANTERIOR = mesAnt;
    row.VAR_MES = variacao(ultimoMes.get(row.PAÍS) ?? 0, mesAnt);
  });

  const sortedData = Object.values(aggregatedData).sort(
    (a: AggregatedRow, b: AggregatedRow) => (b.NEGOCIADO - a.NEGOCIADO)
  );

  const dataSorted = order ? sortedData.sort((a: any, b: any) => order.ordenation === 1 ? a[order.name] - b[order.name] : b[order.name] - a[order.name]) : sortedData

  const firstAggregated = sortedData[0];

  if (!firstAggregated) {
    return <div>Nenhum dado encontrado</div>;
  }

  const header = [
    "País", "Participação", "Negociado", "Importação", "Exportação",
    "Ano Anterior", "Variação", `Mês Anterior (${nomeMesAnterior})`, `Variação ao Mês Anterior (${nomeUltimo} x ${nomeMesAnterior})`,
  ];

  const getRows = (values: AggregatedRow[]): (string | ReactNode)[][] => {
    return values.map((obj) => [
      obj.PAÍS,
      `${percentFormatter(+obj.PARTICIPAÇÃO)}%`,
      <div className="flex gap-1 justify-center"><span>$</span> {formatNumber(obj.NEGOCIADO)}</div>,
      <div className="flex gap-1 justify-center"><span>$</span> {formatNumber(obj.IMPORTAÇÃO)}</div>,
      <div className="flex gap-1 justify-center"><span>$</span> {formatNumber(obj.EXPORTAÇÃO)}</div>,
      <div className="flex gap-1 justify-center"><span>$</span> {formatNumber(obj.ANO_ANTERIOR ?? 0)}</div>,
      <span className={(obj.VAR_ANO ?? 0) >= 0 ? "text-green-600" : "text-red-600"}>{fmtVar(obj.VAR_ANO)}</span>,
      <div className="flex gap-1 justify-center"><span>$</span> {formatNumber(obj.MES_ANTERIOR ?? 0)}</div>,
      <span className={(obj.VAR_MES ?? 0) >= 0 ? "text-green-600" : "text-red-600"}>{fmtVar(obj.VAR_MES)}</span>,
    ]);
  };

  return (
    <div className="relative w-full">
      <TableGeneric
        ordenations={ordenation}
        onOrdenationChange={setOrdenation}
        searchIndexes={[0]}
        enablePagination={false}
        withClick
        onClick={(e: string[]) => {
          selectCountry(e[0]);
        }}
        color={color}
        headers={header}
        title={title}
        rows={getRows(dataSorted)}
      />
    </div>
  );
};

export default BalInfo;
