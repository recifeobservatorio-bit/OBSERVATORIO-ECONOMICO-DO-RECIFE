import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasAtivasNaturezaMesAnterior = ({
  data,
  date,
  title = `Empresas Ativas Naturezas (mês) - Ano Anterior`,
  local = '',
  year,
  color,
}: any) => {
  const dataEmpresas = data['empresas']

  // Com um mês específico selecionado, compara com o MESMO mês do ano anterior; sem filtro
  // de mês, soma o ano anterior inteiro.
  const monthsData = Object.keys(dataEmpresas['mes'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[0]

  const curMonthName = mesEspecifico ? monthLongName(+curMonthData) : 'Ano'

  const mesPast = dataEmpresas['mesPast'] || {}
  const chartData = mesEspecifico
    ? mesPast[curMonthData] || 0
    : Object.values(mesPast).reduce((acc: number, v: any) => acc + v, 0)

  return (
    <>
      {!!chartData && <Card
        local={local}
        title={`${title.replace('mês', curMonthName)}`}
        data={chartData}
        year={year}
        color={color}
      />}
    </>

  )
}

export default EmpresasAtivasNaturezaMesAnterior
