import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";

// Série histórica multianual por município — igual a processEmpresasDataLineGraph, mas agrupando
// por Ano em vez de mês, com o valor médio das linhas daquele ano (o mês passa a ser um detalhe
// interno, não um ponto do gráfico). "data" é o resultado bruto de EmpresasData.fetchAllYearsTempoMedio(),
// já agrupado por Municipio via getGroupValues (mesma forma que "mes" espera).
export const processEmpresasDataLineGraphPorAno = (data: any, toCompare: string[], column: string) => {
  const dataByYear: any[] = []

  for (const municipio of toCompare) {
    const rows: any[] = data[municipio] || []
    const sums = new Map<number, { total: number; count: number }>()

    for (const row of rows) {
      const ano = row['Ano']
      if (ano == null) continue
      const acc = sums.get(ano) || { total: 0, count: 0 }
      acc.total += row[column] || 0
      acc.count += 1
      sums.set(ano, acc)
    }

    for (const [ano, { total, count }] of sums) {
      const media = count ? total / count : 0
      const index = dataByYear.findIndex((d) => d['label'] === ano)
      if (index !== -1) {
        dataByYear[index] = { ...dataByYear[index], [municipio]: media }
        continue
      }
      dataByYear.push({ label: ano, [municipio]: media })
    }
  }

  return dataByYear.sort((a, b) => a['label'] - b['label'])
}

export const processEmpresasDataLineGraph = (data: any, toCompare: string[], column: string) => {
  const dataGroup = toCompare.map((compare: string) => (data[compare] || []).sort((a: any, b: any) => monthOptionIndex(a['Mes Deferimento']) - monthOptionIndex(b['Mes Deferimento'])))

    const dataByMonth: any[] = []

    for (let i = 0; i < dataGroup.length; i++ ) {
      for (let x = 0; x < dataGroup[i].length; x++) {
        const mesIndex = monthOptionIndex(dataGroup[i][x]['Mes Deferimento'])
        const dataMonthExist = dataByMonth.findIndex((data: any) => data['label'] === mesIndex)
        if (dataMonthExist !== -1) {
          dataByMonth[dataMonthExist] = { ...dataByMonth[dataMonthExist], [dataGroup[i][x]['Municipio']]: dataGroup[i][x][column] }
          continue
        }

        dataByMonth.push({ label: mesIndex, [dataGroup[i][x]['Municipio']]: dataGroup[i][x][column]  })
      }
    }

    return dataByMonth
}
