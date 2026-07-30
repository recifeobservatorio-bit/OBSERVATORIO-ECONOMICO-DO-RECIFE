import Card from "@/components/@global/cards/Card";

const EmpresasAtivasMediaAno = ({
  data,
  dataSemMes,
  date,
  title = `Média Empresas Ativas Mensal`,
  local = '',
  year,
  color,
}: any) => {

  // Média acumulada do ano até o mês filtrado (ex: filtrando Junho, tira a média de Jan-Jun,
  // não só o valor de Junho isoladamente).
  const curMonth = Math.max(...data.map((item: any) => item['mes']))
  const dataAteMes = (dataSemMes ?? data).filter((item: any) => item['mes'] <= curMonth)

  const chartData = (dataAteMes.reduce((acc: number, item: any) => acc += item['Empresas Ativas'], 0) / dataAteMes.length).toFixed(0) || 0

  return (
    <Card
      local={local}
      title={title}
      data={chartData}
      year={year}
      color={color}
    />
  );
};

export default EmpresasAtivasMediaAno;
