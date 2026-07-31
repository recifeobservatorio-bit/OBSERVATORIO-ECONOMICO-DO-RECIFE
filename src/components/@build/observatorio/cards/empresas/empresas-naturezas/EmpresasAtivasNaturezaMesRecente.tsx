import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasAtivasNaturezaMesRecente = ({
  data,
  date,
  title = `Empresas Ativas Naturezas (mês)`,
  local = '',
  year,
  color,
}: any) => {
  const dataEmpresas = data['empresas']

  // Se um único mês está selecionado, mostra só aquele mês; sem filtro de mês (todos os
  // meses presentes), soma o ano todo.
  const monthsData = Object.keys(dataEmpresas['mes'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[0]

  const curMonthName = mesEspecifico ? monthLongName(+curMonthData) : 'Ano'

  const chartData = mesEspecifico
    ? dataEmpresas['mes'][curMonthData] || 0
    : Object.values(dataEmpresas['mes']).reduce((acc: number, v: any) => acc + v, 0)

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

export default EmpresasAtivasNaturezaMesRecente
