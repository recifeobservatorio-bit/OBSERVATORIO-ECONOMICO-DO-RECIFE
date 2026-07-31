import Card from "@/components/@global/cards/Card";
import { monthLongName } from "@/utils/formatters/@global/monthLongName";

const EmpresasVariacaoAtivasClassesRecente = ({
  data,
  date,
  title = `Variação Empresas Ativas Classes (mês) - Ano Anterior`,
  local = '',
  year,
  color,
}: any) => {
  const dataEmpresas = data['empresas']

  // Com um mês específico selecionado, compara com o MESMO mês do ano anterior; sem filtro
  // de mês, compara o ano todo (atual) com o ano anterior inteiro.
  const monthsData = Object.keys(dataEmpresas['mes'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  ) ?.[0]

  const mesPast = dataEmpresas['mesPast'] || {}

  const curMonthValor = mesEspecifico
    ? dataEmpresas['mes'][curMonthData] || 0
    : Object.values(dataEmpresas['mes']).reduce((acc: number, v: any) => acc + v, 0)

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

export default EmpresasVariacaoAtivasClassesRecente;
