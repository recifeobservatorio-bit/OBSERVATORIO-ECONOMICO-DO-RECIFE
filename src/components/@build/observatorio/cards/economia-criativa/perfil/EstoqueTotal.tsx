import Card from "@/components/@global/cards/Card";

const EstoqueTotal = ({
  data,
  local = "Recife",
  year,
  color,
}: any) => {
  return (
    <Card
      local={local}
      title="Estoque do emprego formal na Economia Criativa"
      data={data.totalEstoque}
      year={year}
      color={color}
    />
  );
};

export default EstoqueTotal;
