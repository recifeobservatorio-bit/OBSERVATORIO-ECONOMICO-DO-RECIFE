import Card from "@/components/@global/cards/Card";
import { dedupeProducoes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";

const ProducoesTotal = ({ data = [], local = "Recife", year, color }: any) => {
  return (
    <Card
      local={local}
      title="Total de Produções"
      data={dedupeProducoes(data).length}
      year={year}
      color={color}
    />
  );
};

export default ProducoesTotal;
