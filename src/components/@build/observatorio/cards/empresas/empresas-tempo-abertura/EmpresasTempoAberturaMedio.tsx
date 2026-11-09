import Card from '@/components/@global/cards/Card'
import ComparativeCard from '@/components/@global/cards/ComparativeCard'
import { monthLongName } from '@/utils/formatters/@global/monthLongName'
import { monthOptionIndex } from '@/utils/filters/@global/monthFilterHelpers'

const EmpresasTempoAberturaMedio = ({
  data,
  title = `Tempo Médio Abertura de Empresas`,
  compare,
  toCompare,
  comparative = `${toCompare} x ${compare}`,
  year,
  color,
}: any) => {
    const dataEmpresas = data['empresas']

    const dataKeys = Object.keys(dataEmpresas)
    
    const dataFlat = dataKeys.map((dataMap) => dataEmpresas[dataMap]).flat()
    
    const monthIndexes = dataFlat.map((data) => monthOptionIndex(data['Mes Deferimento'])).filter((idx) => idx >= 1 && idx <= 12)
    const curMonthIndex = monthIndexes.length ? Math.max(...monthIndexes) : 0

    const dataFiltred = dataFlat.filter((data: any) => monthOptionIndex(data['Mes Deferimento']) === curMonthIndex)

    const curMonthName = monthLongName(curMonthIndex)

    const chartData = dataFiltred.find(data => data['Municipio'] === compare)?.['Tempo Médio de Abertura'] || 0

    const chartData2 = dataFiltred.find(data => data['Municipio'] === toCompare)?.['Tempo Médio de Abertura'] || 0

  return (
    <ComparativeCard
      title={`${title} (${curMonthName})`}
      data={chartData}
      year={year}
      color={color}
      data2={chartData2}
      comparative={comparative}
      compare={[toCompare, compare]}
      lowerIsBetter
    />
  )
}

export default EmpresasTempoAberturaMedio
