import Card from "@/components/@global/cards/Card";

const EmpresasVariacaoAtivasRecente = ({
  data,
  dataSemMes,
  dataSemMesPast,
  date,
  title = `Variação Mês anterior de Empresas Ativas (mês)`,
  local = '',
  year,
  color,
}: any) => {

  // "Mês atual" respeita o filtro de MÊS selecionado pelo usuário — muda o card quando o
  // filtro muda. "Mês anterior" busca em dataSemMes (todos os meses) pelo valor de 'mes',
  // já que esse ponto pode não existir no array filtrado. Em Janeiro, não há "mês 0" no ano
  // corrente — busca Dezembro do ano anterior em dataSemMesPast.
  const curMonthData = [...data].sort((a: any, b: any) => b['mes'] - a['mes'])?.[0]

  const todosOsMeses = dataSemMes ?? data
  const pastMonthData = curMonthData?.['mes'] === 1
    ? (dataSemMesPast ?? []).find((item: any) => item['mes'] === 12)
    : todosOsMeses.find((item: any) => item['mes'] === curMonthData?.['mes'] - 1)

  const curMonthName = curMonthData?.['Mês']

  const chartData = pastMonthData
    ? (((curMonthData['Empresas Ativas'] - pastMonthData['Empresas Ativas']) / pastMonthData['Empresas Ativas']) * 100).toFixed(2)
    : 0

  return (
    <Card
      local={local}
      title={`${title.replace('mês', curMonthName)}`}
      data={chartData}
      year={year}
      color={color}
      percent
    />
  );
};

export default EmpresasVariacaoAtivasRecente;
