// Selo pequeno com o ícone da seção, no canto do card — usado nas páginas
// fora do Panorama, onde o gráfico já renderiza o próprio título
// internamente (não dá pra reusar o BiCard ali sem duplicar o título).
// Basta envolver o card existente com `relative` e soltar este selo dentro.
const SectionIconBadge = ({ icon }: { icon: React.ReactNode }) => (
  <span className="absolute top-[7px] left-2 w-5 h-5 text-white/90 z-10 pointer-events-none [&>svg]:w-full [&>svg]:h-full">
    {icon}
  </span>
);

export default SectionIconBadge;
