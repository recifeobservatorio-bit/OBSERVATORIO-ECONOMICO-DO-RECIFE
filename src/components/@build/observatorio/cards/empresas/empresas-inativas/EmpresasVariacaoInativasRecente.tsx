import Card from "@/components/@global/cards/Card";
import { monthLongName } from "@/utils/formatters/@global/monthLongName";

const EmpresasVariacaoInativasRecente = ({
  data,
  date,
  title = `Variação Empresas Inativas (mês) - Ano Anterior`,
  local = '',
  year,
  color,
}: any) => {

  // 'mesFiltrado' respeita o filtro de mês selecionado — 'mesPast' é o ano anterior inteiro,
  // por mês. Com um mês específico selecionado, compara com o MESMO mês do ano anterior;
  // sem filtro de mês, compara o ano todo (atual) com o ano anterior inteiro.
  const monthsData = Object.keys(data['mesFiltrado'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  ) ?.[0]

  const mesPast = data['mesPast'] || {}

  const curMonthValor = mesEspecifico
    ? data['mesFiltrado'][curMonthData] || 0
    : Object.values(data['mesFiltrado']).reduce((acc: number, v: any) => acc + v, 0)

  const pastMonthValor = mesEspecifico
    ? mesPast[curMonthData]
    : Object.values(mesPast).reduce((acc: number, v: any) => acc + v, 0)

  const curMonthName = mesEspecifico ? monthLongName(+curMonthData) : 'Ano'

  const chartData = pastMonthValor
    ? (((curMonthValor - pastMonthValor) / pastMonthValor) * 100).toFixed(2)
    : 0

  return (
    <>
      {!!pastMonthValor && <Card
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
