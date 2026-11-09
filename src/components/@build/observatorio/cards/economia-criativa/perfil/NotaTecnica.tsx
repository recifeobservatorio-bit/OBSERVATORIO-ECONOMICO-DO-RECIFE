// Link fixo pro PDF de metodologia ("Economia Criativa - Observatório Econômico do Recife.pdf")
// que o cliente mantém no Google Drive dele — não é dado do parquet, é documentação estática.
const NOTA_TECNICA_URL = "https://drive.google.com/file/d/1zx3ZqIh4XCK0bYg4Xrw_--C8hnFAdxU9/view";

const NotaTecnica = ({ color }: any) => {
  return (
    <a
      href={NOTA_TECNICA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="bi-kpi shrink-0 w-full sm:w-auto items-center justify-center text-center gap-1 py-3 hover:brightness-95"
      style={{ minWidth: "310px", background: "linear-gradient(135deg, #fff 55%, #FDE3D6)" }}
    >
      <h2 className="text-lg font-extrabold text-[#E66C37]">Nota Técnica</h2>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#118DFF]">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className="text-xs text-gray-500 dark:text-gray-400">Metodologia e definições (PDF)</span>
    </a>
  );
};

export default NotaTecnica;
