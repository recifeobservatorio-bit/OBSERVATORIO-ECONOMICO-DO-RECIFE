"use client";
import "./styles/home/style.scss";

import { useState } from "react";

import { Banner } from "@/components/home/Banner";
import DataHighlightsScroller from "@/components/home/DataHighlightsScroller";
import { ExploreSection } from "@/components/home/ExploreSection";
import { Footer } from "@/components/home/Footer";
import { SocialIconsContainer } from "@/components/home/SocialIconsContainer";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  return (
    <div className="min-h-screen dark:bg-[#0C1B2B]">
      <Banner onSearch={handleSearch} />
      <ExploreSection searchTerm={searchTerm} />
      <DataHighlightsScroller />
      <SocialIconsContainer />
      <Footer />
    </div>
  );
};

export default Page;
