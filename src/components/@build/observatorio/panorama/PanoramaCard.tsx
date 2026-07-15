"use client";

import React from "react";

const PanoramaCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="chart-content-wrapper">
      <h3 className="text-center font-semibold w-[90%] text-gray-800 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>}
      <div className="chart-wrapper">{children}</div>
    </div>
  );
};

export default PanoramaCard;
