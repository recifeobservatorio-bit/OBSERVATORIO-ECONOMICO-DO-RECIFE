import { BalancaHeaders } from "../@fetch/balanca-comercial";
import { DataWithFilters } from "../shared";

export interface BalancaEntry extends DataWithFilters<BalancaHeaders> {
    rawData?: BalancaHeaders[];
    filteredDataSemMes?: BalancaHeaders[];
    // Mesmo recorte no ano anterior (card "Total Negociado").
    filteredDataPast?: BalancaHeaders[];
}
  
export interface BalancaGeralData {
    id: "balanca";
    geral: BalancaEntry;
}
  