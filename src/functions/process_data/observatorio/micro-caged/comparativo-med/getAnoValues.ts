import { geralAccFunction } from "../../rais/demografia/geralFuncition"
import { getAccSalario } from "../getAccSalario"

// Mesma lógica de getMunicipiosMonthData, mas agrupando por "Ano" em vez de "mês" —
// usada pelo modo "Ano" do toggle Mês/Ano (série histórica multianual).
export const getMunicipiosAnoData = (data: any, municipios: string[]) => {
  if (!data.length) return

  const dataMuni: { [key: string]: any } = {}

    municipios.map((muni: string) => {
      const dataFiltredMuni = data?.filter((micro: any) => micro['município'] === muni) || []
      if (!dataMuni[muni]) dataMuni[muni] = {}

      const keysObj = ["Ano"]

      const dataSalario = getAccSalario(dataFiltredMuni, keysObj)
      const dataAcc = geralAccFunction(dataFiltredMuni || [], ["Ano"])

      const { 'Ano': muniAcc} = dataAcc
      const { 'Ano': muniSalario } = dataSalario

      for (const key in muniAcc) {
        if (!dataMuni[muni][key]) dataMuni[muni][key] = 0

        dataMuni[muni][key] = muniSalario[key] / muniAcc[key]
      }
    })

    return dataMuni
}
