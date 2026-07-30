import Card from "@/components/@global/cards/Card";

const TaxaTrimestreAnterior = ({
  data,
  date,
  title = `Taxa desemprego`,
  local = '',
  year,
  color,
}: any) => {
 
  const dataMunicipio = data['trimestre']?.['municipiosTrimestre'] || []
  const dataMunicipioPast = data['trimestre']?.['municipiosTrimestrePast'] || []

  const dataQuarter = dataMunicipio.reduce((acc: number, obj: any) => {
    const data = +obj['Trimestre'].split('º')[0]
    acc = acc <= data ? data : acc

    return acc
  }, 0)

  // Trimestre 1 não tem "trimestre anterior" no ano corrente: busca o 4º Trimestre do ano anterior.
  const isPreviousYear = dataQuarter <= 1
  const quarter = isPreviousYear ? 4 : dataQuarter - 1
  const sourceData = isPreviousYear ? dataMunicipioPast : dataMunicipio
  const displayYear = isPreviousYear ? `${+year - 1}` : year

  const dataFiltred = sourceData.filter((obj: any) => +obj['Trimestre'].split('º')[0] == quarter)

  const chartData = dataFiltred.reduce((acc: number, obj: any) => acc += obj['Taxa'] , 0) || 0

  title =  title + ` - (${dataFiltred?.[0]?.['Trimestre'] || 'Não possui dados'})`

  return (
    <Card
      local={local}
      title={`${title}`}
      data={chartData}
      year={displayYear}
      color={color}
    />
  );
};

export default TaxaTrimestreAnterior;
