import Card from "@/components/@global/cards/Card";

const ValorMedioAvaliacaoCard = ({ data, year, color }: any) => {
  const value = data?.cards?.find((c: any) => c.title === "Valor médio (mediana)")?.value ?? 0;
  return <Card title="Valor Médio (Mediana)" data={value} year={year ?? "—"} color={color} local="ITBI" />;
};

export default ValorMedioAvaliacaoCard;
