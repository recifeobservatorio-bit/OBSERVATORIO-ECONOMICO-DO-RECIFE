// Mesma lógica de processMunicipiosMonthValues, mas para a chave "ano" (saída de getMunicipiosAnoData).
export const processMunicipiosAnoValues = (data: any, toCompare: string[]) => {
  const dataFull: any[] = []

  for (const keyMuni in data) {
    if (toCompare.includes(keyMuni)) {
        for (const keyAno in data[keyMuni]) {
            const dataAnoIndex = dataFull.findIndex((obj: any) => obj['ano'] === keyAno )

            if (dataAnoIndex === -1) {
                dataFull.push({ ano: keyAno, [keyMuni]: data[keyMuni][keyAno] })
            } else {
                dataFull[dataAnoIndex] = { ...dataFull[dataAnoIndex], [keyMuni]: data[keyMuni][keyAno] }
            }
        }
    }
  }

  return dataFull.sort((a, b) => Number(a.ano) - Number(b.ano))
}
