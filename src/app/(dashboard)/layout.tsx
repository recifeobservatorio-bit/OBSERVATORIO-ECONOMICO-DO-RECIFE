"use client";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";

import { DrawingStoreProvider } from "@/components/@global/excalidraw/context/drawingStoreContext";
import { ExcalidrawProvider } from "@/components/@global/excalidraw/context/useContext";
import FloatingExcalidrawButton from "@/components/@global/excalidraw/floatButton";
import ChartSelectionIndicator from "@/components/@global/features/ChartSelectionIndicator";
import HiddenChartsPanel from "@/components/@global/features/HiddenChartsPanel";
import ToggleDarkMode from "@/components/@global/features/ToggleDarkMode";
import { LoadingScreen } from "@/components/home/LoadingScreen";
import FilterSidebar from "@/components/random_temp/FilterSidebar";
import { Sidebar } from "@/components/random_temp/Sidebar";
import { ChartSelectionProvider, useChartSelection } from "@/context/ChartSelectionContext";
import { DashboardProvider } from "@/context/DashboardContext";
import "@excalidraw/excalidraw/index.css";

function ChartSelectionResetOnNavigate() {
  const pathname = usePathname();
  const { clear } = useChartSelection();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={< LoadingScreen />}>
      <DashboardProvider>
        <ChartSelectionProvider>
          <ChartSelectionResetOnNavigate />
          <div className="h-screen flex flex-col overflow-hidden">
            <Sidebar />
            <div className="flex-1 min-h-0 flex overflow-hidden">
              <FilterSidebar />
              <div className="flex-1 bi-canvas overflow-y-auto overflow-x-hidden flex flex-col pb-[1em] lg:pb-0">
                <ToggleDarkMode />
                <HiddenChartsPanel />
                <ChartSelectionIndicator />
                <DrawingStoreProvider>
                  <ExcalidrawProvider>
                    {children}
                    <FloatingExcalidrawButton />
                  </ExcalidrawProvider>
                </DrawingStoreProvider>
              </div>
            </div>
          </div>
        </ChartSelectionProvider>
      </DashboardProvider>
    </Suspense>
  );
}