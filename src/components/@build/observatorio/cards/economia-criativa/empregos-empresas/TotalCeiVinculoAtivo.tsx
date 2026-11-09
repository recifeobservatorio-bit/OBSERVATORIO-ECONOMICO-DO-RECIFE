import Card from "@/components/@global/cards/Card";

const TotalCeiVinculoAtivo = ({ data = [], local = "Recife", year, color }: any) => {
  return (
    <Card
      local={local}
      title="Total cei vinculo ativo"
      data={data.length}
      year={year}
      color={color}
    />
  );
};

export default TotalCeiVinculoAtivo;
