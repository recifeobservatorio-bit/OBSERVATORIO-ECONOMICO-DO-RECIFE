import Card from "@/components/@global/cards/Card";

const EmpresasTotal = ({
  data = [],
  local = "Recife",
  year,
  color,
}: any) => {
  return (
    <Card
      local={local}
      title="Total de Empresas (Economia Criativa)"
      data={data.length}
      year={year}
      color={color}
    />
  );
};

export default EmpresasTotal;
