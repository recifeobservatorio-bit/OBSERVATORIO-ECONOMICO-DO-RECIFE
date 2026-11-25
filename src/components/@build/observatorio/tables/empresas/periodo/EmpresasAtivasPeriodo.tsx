import EmpresasPeriodoTabela from "./EmpresasPeriodoTabela";

const EmpresasAtivasPeriodo = ({ data }: any) => (
  <EmpresasPeriodoTabela data={data} title="Quantidade de Empresas Abertas no Recife por Período" label="Empresas abertas" />
);

export default EmpresasAtivasPeriodo;
