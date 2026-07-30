import Card from '@/components/@global/cards/Card'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'

const EmpresasAtivasInativasMesRecente = ({
  data,
  date,
  title = `Variação Empresas Abertas e Inativas (mês)`,
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

  const ativasValor = data['ativas']['mesFiltrado'][curMonthData]
  const inativasValor = data['inativas']['mesFiltrado'][curMonthData]

  const chartData = inativasValor ? (((ativasValor - inativasValor) / inativasValor) * 100).toFixed(0) : 0

  return (
    <>
      {!!inativasValor && <Card
        local={local}
        title={`${title.replace('mês', curMonthName)}`}
        data={chartData}
        year={year}
        color={color}
        percent
      />}
    </>
  )
}

export default EmpresasAtivasInativasMesRecente
