import { monthOptionIndex } from "@/utils/filters/@global/monthFilterHelpers";

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
