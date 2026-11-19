import { Poppins } from "next/font/google";

import "./globals.css";
import DataPrefetchGate from "@/components/@global/features/DataPrefetchGate";
import { WithLoading } from "@/components/home/WithLoading";
import { AuthProvider } from "@/context/AuthContext";
import { LoadingProvider } from "@/context/LoadingContext";

// Layout raiz fica no servidor: com "use client" aqui o next/font gerava uma classe
// diferente no servidor e no navegador (aviso de hidratação no <body>).
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>
        <AuthProvider>
          <LoadingProvider>
            <WithLoading>
              <DataPrefetchGate>{children}</DataPrefetchGate>
            </WithLoading>
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
