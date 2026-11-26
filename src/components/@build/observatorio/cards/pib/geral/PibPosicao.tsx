import Card from "@/components/@global/cards/Card";

const FIELD = "Produto Interno Bruto,  a preços correntes (R$ 1.000)";
const REGION = "Nome da Grande Região";

// Posição do município dentro da própria região (Recife → "Posição Nordeste"),
// em vez da posição nacional. Pedido: "card posição nordeste invés do nacional".
const PibPosicao = ({
  data,
  year,
  color,
  capital,
}: any) => {
  const selected = data.current.flat();
  const value = selected.reduce((acc: number, item: any) => acc + (Number(item[FIELD]) || 0), 0);
  const regiao: string = selected[0]?.[REGION] || "Nordeste";

  const itens = data.rawDataCurrent.filter(
    (item: any) => item[REGION] === regiao && Number(item[FIELD]) >= value
  );

  return data.current.length > 1 ? (
    <></>
  ) : (
    <Card
      local={capital}
      title={`Posição ${regiao}`}
      data={itens.length}
      year={year}
      color={color}
      position={true}
    />
  );
};

export default PibPosicao;
