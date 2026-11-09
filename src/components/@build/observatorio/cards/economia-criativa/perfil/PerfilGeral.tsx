import React, { ElementType } from "react";

const PerfilGeral = ({
  data,
  cards,
  ColorPalette,
  year,
}: any) => {
  const chartData = {
    totalEstoque: data.ativ.length,
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-2">
      {cards.map(({ Component }: { Component: ElementType }, index: number) => (
        <React.Suspense fallback={<div>Carregando...</div>} key={index}>
          <Component data={chartData} year={year} color={ColorPalette[index]} />
        </React.Suspense>
      ))}
    </div>
  );
};

export default PerfilGeral;
