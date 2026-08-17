import Card from "@/components/@global/cards/Card";

const TotalTransmissoesCard = ({ data, year, color }: any) => {
  const value = data?.cards?.find((c: any) => c.title === "Total de transações")?.value ?? 0;
  return <Card title="Total de Transações" data={value} year={year ?? "—"} color={color} local="ITBI" />;
};

export default TotalTransmissoesCard;
