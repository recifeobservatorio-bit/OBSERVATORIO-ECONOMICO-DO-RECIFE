import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasInativasMesAnterior = ({
  data,
  date,
  title = `Empresas Inativas anteriormente (mês)`,
  local = '',
  year,
  color,
}: any) => {
  // 'mesFiltrado' respeita o filtro de mês selecionado — 'mes' é a série sem esse filtro,
  // usada só pelo gráfico de linha no modo "Ano".
  const monthsData = Object.keys(data['mesFiltrado'])

  const curMonthData = monthsData.sort(
    (a: any, b: any) => +b - +a,
  )?.[1]

  const curMonthName = monthLongName(+curMonthData)

  const chartData = data['mesFiltrado'][curMonthData] || 0

  return (
    <>
      {curMonthData && <Card
        local={local}
        title={`${title.replace('mês', curMonthName)}`}
        data={chartData}
        year={year}
        color={color}
      />}
    </>
    
  )
}

export default EmpresasInativasMesAnterior
