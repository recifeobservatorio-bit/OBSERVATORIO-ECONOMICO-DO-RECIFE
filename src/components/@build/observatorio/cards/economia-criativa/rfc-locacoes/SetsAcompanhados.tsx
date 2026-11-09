import Card from "@/components/@global/cards/Card";
import { dedupeSolicitacoes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";

const SetsAcompanhados = ({ data = [], local = "Recife", year, color }: any) => {
  const producoes = dedupeSolicitacoes(data);
  const total = producoes.reduce((acc, item) => acc + (item["SETS ACOMPANHADOS"] || 0), 0);

  return (
    <Card
      local={local}
      title="Sets Acompanhados"
      data={total}
      year={year}
      color={color}
    />
  );
};

export default SetsAcompanhados;
