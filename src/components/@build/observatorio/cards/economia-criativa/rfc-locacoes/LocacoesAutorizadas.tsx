import Card from "@/components/@global/cards/Card";

// Cada linha de rfc.parquet já é uma locação autorizada (1 produção com N locações = N linhas) —
// diferente das outras métricas de RFC Produções, aqui não precisa dedupe por ID.
const LocacoesAutorizadas = ({ data = [], local = "Recife", year, color }: any) => {
  return (
    <Card
      local={local}
      title="Locações Autorizadas"
      data={data.length}
      year={year}
      color={color}
    />
  );
};

export default LocacoesAutorizadas;
