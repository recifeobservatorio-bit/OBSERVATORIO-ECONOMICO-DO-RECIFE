import Card from "@/components/@global/cards/Card";
import { dedupeSolicitacoes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";

const DiasFilmagem = ({ data = [], local = "Recife", year, color }: any) => {
  const producoes = dedupeSolicitacoes(data);
  const total = producoes.reduce((acc, item) => acc + (item["DIARIAS DE FILMAGEM"] || 0), 0);

  return (
    <Card
      local={local}
      title="Dias de Filmagem"
      data={total}
      year={year}
      color={color}
    />
  );
};

export default DiasFilmagem;
