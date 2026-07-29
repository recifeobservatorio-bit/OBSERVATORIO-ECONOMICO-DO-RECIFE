import { PortoAtracacaoHeaders, PortoCargaHeaders, PortoDestinoHeaders, PortoMercadoHeaders, PortoOrigemDestinoHeaders, PortoPassageirosHeaders, PortoCoordHeaders, PortoMeses } from "../@fetch/porto";
import { DataWithFilters } from "../shared";

export interface PortoGeralData {
  id: "porto";
  atracacao: DataWithFilters<PortoAtracacaoHeaders> | PortoAtracacaoHeaders[];
  carga: PortoCargaHeaders[];
  /** Mesmo recorte de atracacao/carga, mas ignorando o filtro de Mes — usado pelos
   * gráficos de linha (CargasAno/OperacaoCargasAno) pra não colapsar num ponto só. */
  atracacaoSemMes?: PortoAtracacaoHeaders[];
  cargaSemMes?: PortoCargaHeaders[];
  /** Mesmo recorte de atracacaoSemMes/cargaSemMes, mas sem filtro de ano — série
   * histórica completa, usada pelo modo "Ano" do toggle Mês/Ano. */
  atracacaoPorAno?: PortoAtracacaoHeaders[];
  cargaPorAno?: PortoCargaHeaders[];
  months?: PortoMeses;
  coords: [PortoCoordHeaders[], number[]];
  dictionaries: {
    origem: PortoOrigemDestinoHeaders[];
    destino: PortoDestinoHeaders[];
    mercado: PortoMercadoHeaders[];
  };
  rawData: RawDataPortos;
}

export interface RawDataPortos {
    atracacao: PortoAtracacaoHeaders[];
    carga: PortoCargaHeaders[];
    /** Mesmo recorte de atracacao/carga, mas com a série histórica completa (todos os
     * anos) — usada pelo modo "Ano" do toggle Mês/Ano. */
    atracacaoPorAno?: PortoAtracacaoHeaders[];
    cargaPorAno?: PortoCargaHeaders[];
}

export interface PortoOperacaoData {
    acao: "Cabotagem" | "Total" | "Importação" | "Exportação" | "Outros";
    cargas: PortoCargaHeaders[];
    totalPeso: number;
}

export interface PassageirosPortoAno extends DataWithFilters<PortoPassageirosHeaders> {}

export interface PortoPassageirosData {
    current: PassageirosPortoAno;
    past: PassageirosPortoAno;
    /** Série histórica completa (todos os anos) — usada pelo modo "Ano" do toggle Mês/Ano. */
    porAno?: PortoPassageirosHeaders[];
}
  
export interface PortoPassageirosResult {
    id?: "porto-passageiros";
    passageiros: PortoPassageirosData
}

export interface PortoPassageirosCardData {
  current?: number;
  past?: number;
  variant?: number | string;
}

export interface PortoPassageirosOutputData extends PortoPassageirosCardData {
  passageiros: {
    current: PortoPassageirosHeaders[];
    past: PortoPassageirosHeaders[];
    /** Série histórica completa (todos os anos) — usada pelo modo "Ano" do toggle Mês/Ano. */
    porAno?: PortoPassageirosHeaders[];
  }
}

export type PortoDataResult = PortoGeralData | PortoPassageirosResult;