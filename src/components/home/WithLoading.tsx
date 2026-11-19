"use client";

import { LoadingScreen } from "@/components/home/LoadingScreen";
import { useLoading } from "@/context/LoadingContext";

export function WithLoading({ children }: { children: React.ReactNode }) {
  const { loading } = useLoading();
  return (
    <>
      {loading && <LoadingScreen />}
      {children}
    </>
  );
}
