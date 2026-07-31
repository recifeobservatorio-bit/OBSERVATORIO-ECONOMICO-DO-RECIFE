import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasAtivasInativasMesRecente = ({
  data,
  date,
  title = `Saldo Empresas Abertas e Inativas (mês)`,
  local = '',
  year,
  color,
}: any) => {
  // 'mesFiltrado' respeita o filtro de mês selecionado. Se um único mês está selecionado,
  // mostra só aquele mês; sem filtro de mês (todos os meses presentes), soma o ano todo.
  const monthsData = Object.keys(data['ativas']['mesFiltrado'])
  const mesEspecifico = monthsData.length === 1

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[0]

  const curMonthName = mesEspecifico ? monthLongName(+curMonthData) : 'Ano'

  const ativasValor = mesEspecifico
    ? data['ativas']['mesFiltrado'][curMonthData] || 0
    : Object.values(data['ativas']['mesFiltrado']).reduce((acc: number, v: any) => acc + v, 0)

  const inativasValor = mesEspecifico
    ? data['inativas']['mesFiltrado'][curMonthData] || 0
    : Object.values(data['inativas']['mesFiltrado']).reduce((acc: number, v: any) => acc + v, 0)

  // Saldo: quantas empresas a mais abriram do que fecharam no período (pode ser negativo).
  const chartData = ativasValor - inativasValor

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

export default EmpresasAtivasInativasMesRecente
