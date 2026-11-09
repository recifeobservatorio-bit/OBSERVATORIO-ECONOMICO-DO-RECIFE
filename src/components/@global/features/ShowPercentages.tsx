export const ShowPercentages = ({
  showPercentage,
  setShowPercentage,
}: {
  showPercentage: boolean;
  setShowPercentage: (val: boolean) => void;
}) => {
  // Botão compacto (chip): o anterior, grande e com margem, tomava ~45px de
  // altura de cada pizza — no painel de tela única isso é área de gráfico.
  return (
    <div className="text-center button-container">
      <button
        onClick={() => setShowPercentage(!showPercentage)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-0.5 px-2 mt-1 rounded text-[11px] leading-4"
        title={showPercentage ? "Ocultar porcentagens" : "Mostrar porcentagens"}
      >
        {showPercentage ? "Ocultar %" : "Mostrar %"}
      </button>
    </div>
  );
};
