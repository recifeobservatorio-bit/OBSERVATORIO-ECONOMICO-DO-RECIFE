import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasAtivasMesRecente = ({
  data,
  date,
  title = `Empresas Abertas (mês)`,
  local = '',
  year,
  color,
}: any) => {
  // 'mesFiltrado' respeita o filtro de mês selecionado — 'mes' é a série sem esse filtro,
  // usada só pelo gráfico de linha no modo "Ano".
  const monthsData = Object.keys(data['ativas']['mesFiltrado'])

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[0]

  const curMonthName = monthLongName(+curMonthData)

  const chartData = data['ativas']['mesFiltrado'][curMonthData] || 0

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

export default EmpresasAtivasMesRecente
