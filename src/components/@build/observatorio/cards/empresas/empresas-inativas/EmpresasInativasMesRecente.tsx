import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasInativasMesRecente = ({
  data,
  date,
  title = `Empresas Inativas (mês)`,
  local = '',
  year,
  color,
}: any) => {
  // 'mesFiltrado' respeita o filtro de mês selecionado. Se um único mês está selecionado,
  // mostra só aquele mês; sem filtro de mês (todos os meses presentes), soma o ano todo.
  const monthsData = Object.keys(data['mesFiltrado'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[0]

  const curMonthName = mesEspecifico ? monthLongName(+curMonthData) : 'Ano'

  const chartData = mesEspecifico
    ? data['mesFiltrado'][curMonthData] || 0
    : Object.values(data['mesFiltrado']).reduce((acc: number, v: any) => acc + v, 0)

  return (
    <Card
      local={local}
      title={`${title.replace('mês', curMonthName)}`}
      data={chartData}
      year={year}
      color={color}
    />
  )
}

export default EmpresasInativasMesRecente
