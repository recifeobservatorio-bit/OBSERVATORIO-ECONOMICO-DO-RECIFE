"use client";

import React from "react";

import { Header } from "./Header";
import { NavBarHome } from "./NavBarHome";

export const Banner: React.FC = () => {
  return (
    <div className="relative">
      {/* Gradiente de fundo */}
      <div className="absolute bottom-0 w-full h-[50px] bg-gradient-to-b from-transparent to-white transition-opacity duration-[20ms] ease-out dark:opacity-0 dark:duration-[460ms]" />
      {/* Gradiente escuro */}
      <div className="absolute bottom-0 w-full h-[50px] bg-gradient-to-b from-transparent to-[#0C1B2B] transition-opacity duration-[300ms] ease-out opacity-0 dark:opacity-100 dark:duration-[590ms]" />

      <section className="bg-[url('/images/backgrounds/home_background.avif')] w-full bg-center bg-cover">
        <Header />
        <NavBarHome />

        <div className="flex flex-col justify-center items-center">
          <div className="pt-32 pb-60 gap-px w-full flex flex-col px-3 justify-center items-center">
            <h1 className="text-white font-medium text-3xl text-center">
              OBSERVATÓRIO ECONÔMICO DO RECIFE
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};
