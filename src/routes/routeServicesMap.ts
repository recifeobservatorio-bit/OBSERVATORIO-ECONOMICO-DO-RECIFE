import { Service } from "@/@types/observatorio/shared";
import { aeroportoDataService } from "@/services/@data/aeroportoDataService";
import { balancaDataService } from "@/services/@data/balancaComercialDataService";
import { empregosDataService } from "@/services/@data/empregosDataService";
import { empresasDataService } from "@/services/@data/empresasDataService";
import { ipcaDataService } from "@/services/@data/ipcaDataService";
import { microCagedDataService } from "@/services/@data/microCagedService";
import { pibDataService } from "@/services/@data/pibDataService";
import { portoDataService } from "@/services/@data/portoDataService";
import { raisDataService } from "@/services/@data/raisDataService";
import { economiaCriativaDataService } from "@/services/@data/economiaCriativaDataService";
import { cnaeHistoricoDataService } from "@/services/@data/cnaeHistoricoDataService";
import { rfcDataService } from "@/services/@data/rfcDataService";
import { rankingDataService } from "@/services/@data/rankingDataService";
import { combustiveisDataService } from "@/services/@data/combustiveisDataService";
import { tributosDataService } from "@/services/@data/tributosDataService";
import { capagDataService } from "@/services/@data/capagDataService";

export const routeServicesMap: Record<
  string,
  Record<string, Service<any>>
> = {
  "/observatorio/ipca": {
    geral: ipcaDataService,
    grupos: ipcaDataService,
    analitico: ipcaDataService,
    // etc. Se quiser mesmo service, ok
  },

    "/observatorio/portos": {
      geral: portoDataService,
      operacao: portoDataService,
      comparativo: portoDataService,
      passageiro: portoDataService,
      // etc. Se quiser mesmo service, ok
    },


  "/observatorio/ranking": {
    geral: rankingDataService,
    dimensao: rankingDataService,
    pilar: rankingDataService,
    indicador: rankingDataService,
    // etc. Se quiser mesmo service, ok
  },

  // Aeroportos
  "/observatorio/aeroportos": {
    geral: aeroportoDataService,
    comparativo: aeroportoDataService,
    embarque: aeroportoDataService,
    aena: aeroportoDataService,
    // etc. Se quiser mesmo service, ok
  },

  // Pib
  "/observatorio/pib": {
    // Se tiver tabs diferentes ("geral", "analitico", etc.), aponte para balancaDataService
    geral: pibDataService,
    comparativo: pibDataService,
    capita: pibDataService,
  },

  // Balança Comercial
  "/observatorio/balanca-comercial": {
    // Se tiver tabs diferentes ("geral", "analitico", etc.), aponte para balancaDataService
    geral: balancaDataService,
    analitico: balancaDataService,
  },

  "/observatorio/empregos": {
    geral: empregosDataService,
    comparativo: empregosDataService,
    desemprego: empregosDataService,
  },

  "/observatorio/rais": {
    geral: raisDataService,
    desligamento: raisDataService,
    diversidade: raisDataService,
    grupo: raisDataService,
    estoque: raisDataService,
    remuneracao: raisDataService,
  },

  "/observatorio/economia-criativa": {
    perfil: economiaCriativaDataService,
    movimentacao: economiaCriativaDataService,
    diversidade: economiaCriativaDataService,
    "empregos-setor": economiaCriativaDataService,
    "empregos-empresas": economiaCriativaDataService,
    salarios: economiaCriativaDataService,
    "negocios-criativos": cnaeHistoricoDataService,
    "rfc-producoes": rfcDataService,
    "rfc-locacoes": rfcDataService,
    "rfc-painel": rfcDataService,
  },

  "/observatorio/micro-caged": {
    geral: microCagedDataService,
    saldo: microCagedDataService,
    media: microCagedDataService,
    "comparativo-mov": microCagedDataService,
    "comparativo-med": microCagedDataService,
    salario: microCagedDataService,
  },

  "/observatorio/empresas": {
    geral: empresasDataService,
    "empresas-ativas": empresasDataService,
    "empresas-inativas": empresasDataService,
    "empresas-ativas-inativas": empresasDataService,
    "empresas-naturezas": empresasDataService,
    "empresas-classes": empresasDataService,
    "comparativo-empresas-classes": empresasDataService,
    "empresas-abertas-fechadas": empresasDataService,
    "empresas-tempo-abertura": empresasDataService
    // saldo: empresasGeralFilters,
    // media: empresasGeralFilters,
    // "comparativo-mov": empresasGeralFilters,
    // "comparativo-med": empresasGeralFilters,
    // salario: empresasGeralFilters,
  },
   
  "/observatorio/combustiveis": {
    geral: combustiveisDataService,
    comparativo: combustiveisDataService,
    regional: combustiveisDataService,
    estadual: combustiveisDataService,
    municipal: combustiveisDataService,
  },

  "/observatorio/tributos": {
    "mercado-imobiliario": tributosDataService,
    "mercado-imobiliario-avaliacoes": tributosDataService,
    "mercado-imobiliario-pesquisa": tributosDataService,
    "iptu-contribuintes": tributosDataService,
    "iptu-valores": tributosDataService,
    "iptu-pesquisa": tributosDataService,
  },

  "/observatorio/capag": {
    geral: capagDataService,
  },

  // E assim por diante ...
};
