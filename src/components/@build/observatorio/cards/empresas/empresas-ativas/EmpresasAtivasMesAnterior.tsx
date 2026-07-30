import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasAtivasMesAnterior = ({
  data,
  date,
  title = `Empresas Abertas (mês) - Ano Anterior`,
  local = '',
  year,
  color,
}: any) => {
  // 'mesFiltrado' respeita o filtro de mês selecionado — 'mesPast' é o ano anterior inteiro,
  // por mês. Com um mês específico selecionado, compara com o MESMO mês do ano anterior;
  // sem filtro de mês, soma o ano anterior inteiro.
  const monthsData = Object.keys(data['mesFiltrado'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[0]

  const curMonthName = mesEspecifico ? monthLongName(+curMonthData) : 'Ano'

  const mesPast = data['mesPast'] || {}
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

export default EmpresasAtivasMesAnterior
