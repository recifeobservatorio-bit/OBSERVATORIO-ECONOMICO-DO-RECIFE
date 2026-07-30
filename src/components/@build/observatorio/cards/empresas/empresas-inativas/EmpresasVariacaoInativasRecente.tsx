import Card from "@/components/@global/cards/Card";
import { monthLongName } from "@/utils/formatters/@global/monthLongName";

const EmpresasVariacaoInativasRecente = ({
  data,
  date,
  title = `Variação Mês anterior de Empresas Inativas (mês)`,
  local = '',
  year,
  color,
}: any) => {

  // 'mesFiltrado' respeita o filtro de mês selecionado — 'mes' é a série sem esse filtro,
  // usada só pelo gráfico de linha no modo "Ano".
  const monthsData = Object.keys(data['mesFiltrado'])

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  ) ?.[0]

  const pastMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[1]

  const curMonthName = monthLongName(+curMonthData)

  const chartData = (((data['mesFiltrado'][curMonthData] - data['mesFiltrado'][pastMonthData]) / data['mesFiltrado'][pastMonthData]) * 100).toFixed(2)

  return (
    <>
      {pastMonthData && <Card
        local={local}
        title={`${title.replace('mês', curMonthName)}`}
        data={chartData}
        year={year}
        color={color}
        percent
      />}
    </>

  );
};

export default EmpresasVariacaoInativasRecente;
