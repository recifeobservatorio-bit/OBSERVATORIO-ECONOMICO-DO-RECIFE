import Card from "@/components/@global/cards/Card";
import { dedupeSolicitacoes } from "@/functions/process_data/observatorio/rfc/dedupeProducoes";

function mediana(valores: number[]): number {
  if (!valores.length) return 0;
  const sorted = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[meio - 1] + sorted[meio]) / 2 : sorted[meio];
}

const DiasParaAutorizacao = ({ data = [], local = "Recife", year, color }: any) => {
  const producoes = dedupeSolicitacoes(data);
  const valores = producoes.map((item) => item["Dias Para Autorização"]).filter((v) => v != null);

  return (
    <Card
      local={local}
      title="Mediana de Dias para Autorização"
      data={mediana(valores)}
      year={year}
      color={color}
    />
  );
};

export default DiasParaAutorizacao;
