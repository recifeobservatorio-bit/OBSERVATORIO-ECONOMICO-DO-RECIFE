import Card from "@/components/@global/cards/Card";

const VariacaoTrimesteAnterior = ({
  data,
  date,
  title = `Variação trimestre anterior`,
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
  const quarterPast = isPreviousYear ? 4 : dataQuarter - 1
  const quarterCur = dataQuarter
  const pastSourceData = isPreviousYear ? dataMunicipioPast : dataMunicipio

  const dataPastFiltred = pastSourceData.filter((obj: any) => +obj['Trimestre'].split('º')[0] == quarterPast)
  const dataCurFiltred = dataMunicipio.filter((obj: any) => +obj['Trimestre'].split('º')[0] == quarterCur)

  const taxaPastData = dataPastFiltred.reduce((acc: number, obj: any) => acc += obj['Taxa'] , 0) || 0
  const taxaCurData = dataCurFiltred.reduce((acc: number, obj: any) => acc += obj['Taxa'] , 0) || 0
  
  const chartData = taxaPastData > 0 ? (taxaCurData - taxaPastData).toFixed(2) : 0

  title += taxaPastData > 0 ? '' : ' - (Não possui dados)'

  return (
    <Card
      local={local}
      title={`${title}`}
      data={chartData}
      year={year}
      color={color}
    />
  );
};

export default VariacaoTrimesteAnterior;
