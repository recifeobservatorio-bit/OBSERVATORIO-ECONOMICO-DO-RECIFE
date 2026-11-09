// Como usar: Adicione diversos casos de uso de paletas que você acha que podem se repetir.
// Dedique esta sessão para colorir os gráficos de diversos tipos!

class ColorPalette {
  // Paleta padrão do Power BI (mesma ordem do tema dos relatórios do
  // Observatório): azul-marinho primeiro, depois azul, laranja, roxo...
  static default = [
    "#12239E",
    "#118DFF",
    "#E66C37",
    "#6B007B",
    "#E044A7",
    "#744EC2",
    "#D9B300",
    "#D64550",
    "#197278",
    "#1AAB40",
    "#15C6F4",
    "#4092FF",
    "#FFA058",
    "#BE5DC9",
    "#F472D0",
    "#B5A1FF",
    "#C4A200",
    "#FF8080",
    "#00DBBC",
    "#5BD667",
    "#0091D5",
];
    static pastel = ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"];
    static vibrant = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF5"];
    static dark = ["#2C3E50", "#34495E", "#1C2833", "#212F3D", "#2E4053"];

    // Semântica de "dado bom" (ex: emprego/admissão) vs "dado ruim" (ex: desemprego/demissão).
    // Em gráficos de linha o ruim fica em vermelho (maior alerta); nos demais, em laranja.
    static status = {
      good: "#12239E",
      bad: "#E66C37",
      badLine: "#EF4444",
      neutral: "#9CA3AF",
    };

    static getPalette(paletteName: string): string[] {
      switch (paletteName) {
        case "pastel":
          return this.pastel;
        case "vibrant":
          return this.vibrant;
        case "dark":
          return this.dark;
        default:
          return this.default;
      }
    }
  }
  
  export default ColorPalette;
  