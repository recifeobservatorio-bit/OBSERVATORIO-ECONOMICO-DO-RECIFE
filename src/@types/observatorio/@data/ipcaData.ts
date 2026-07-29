import { IpcaGeralHeaders, IpcaGrupoHeaders, IpcaTabelaHeaders } from "../@fetch/ipca";
import { DataWithFilters } from "../shared";

export interface IpcaGeralData extends DataWithFilters<IpcaGeralHeaders> {
  /** IPCA anual por capital (série histórica completa) — usada pelo modo "Ano" do toggle Mês/Ano. */
  porAno?: any[];
}

export interface IpcaGrupoData extends DataWithFilters<IpcaGrupoHeaders> {}

export interface IpcaTabelaData {
  id: "ipca-tabelas";
  geral: IpcaGeralData;
  tabelas: DataWithFilters<IpcaTabelaHeaders>;
}

export type IpcaDataResult = 
  | { id: "ipca"; geral: IpcaGeralData }
  | { id: "ipca-grupos"; grupos: IpcaGrupoData }
  | IpcaTabelaData;
