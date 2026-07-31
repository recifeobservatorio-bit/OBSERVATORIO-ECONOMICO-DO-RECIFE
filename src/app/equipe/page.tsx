"use client";

import "../styles/home/style.scss";
import "../styles/explore/style.scss";

import React from "react";

import { HighlightMemberProps, HighlightSection } from "@/components/equipe/HighlightSection";
import { TeamGrid } from "@/components/equipe/TeamGrid";
import { TechnologyDesignSection } from "@/components/equipe/TechnologyDesignSection";
import { Footer } from "@/components/home/Footer";
import { NavBarHome } from "@/components/home/NavBarHome";
import { ObsHeader } from "@/components/home/ObsHeader";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  imagePosition?: string;
}

const highlightedMembers: HighlightMemberProps[] = [
  {
    name: "Victor Marques",
    role: "Prefeito da Cidade do Recife",
    image: "/images/team/prefeito.jpg",
    description:
      "Natural do Recife, Victor Marques é engenheiro civil formado pela Universidade de Pernambuco (UPE). Foi eleito vice-prefeito do Recife nas Eleições de 2024, ao lado do prefeito João Campos, em primeiro turno, com 78,11% dos votos válidos — a maior votação da história da capital pernambucana. À frente da Secretaria de Infraestrutura do Recife desde 2025, esteve responsável pela coordenação de obras públicas e intervenções urbanas em áreas como mobilidade, drenagem, contenção de encostas, urbanização e requalificação de espaços públicos, conduzindo projetos estruturadores na cidade. Entre 2021 e 2024, atuou como chefe de gabinete da Prefeitura do Recife, participando da coordenação de ações de governo e do acompanhamento de projetos estratégicos. Anteriormente, exerceu a mesma função na Câmara dos Deputados, no período de 2019 a 2020. Victor Marques tem 31 anos e é casado com a médica Eduarda Neiva.",
  },
  {
    name: "Felipe Matos",
    role: "Secretário de Desenvolvimento Econômico",
    image: "/images/team/secretario.jpg",
    description:
      "Graduado e Mestre em Economia pela Universidade Federal de Pernambuco (UFPE) e MBA Executivo pelo IESE (Espanha), Felipe trabalhou por 9 anos em empresa de engenharia até se tornar Diretor Financeiro na instituição, no ano de 2018. No ano de 2021, entrou para a Administração Pública como Secretário de Planejamento, Gestão e Transformação Digital da Prefeitura do Recife, com o fito de monitorar todas as ações estratégicas do governo. Além disso, como Secretário, Felipe assumiu a liderança sobre a área de Concessões Públicas e Parcerias Público-Privadas, bem como nas áreas de Transformação Digital, Orçamento, Gestão de Pessoas e Licitações. Essa experiência transversal permitiu que o mesmo apoiasse as secretarias finalísticas da Prefeitura do Recife no desenho e viabilização de diversas políticas públicas bem-sucedidas, logrando êxito em ampliar a atuação da Secretaria para além de suas atribuições básicas.",
    reverse: true,
    imagePosition: "object-top",
  },
  {
    name: "Gelisa Bosi",
    role: "Secretária Executiva de Desenvolvimento e Inovação",
    image: "/images/team/sec-exc-gelisa.jpg",
    description:
      "Responsável por atrair investimentos, fortalecer o ambiente de negócios e liderar projetos estratégicos no Recife. Atua na expansão de empreendimentos, na desburocratização de processos e na promoção da inovação, inclusão produtiva e transformação digital, impulsionando o desenvolvimento econômico sustentável da cidade.",
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Ronnie Lorena",
    role: "Gerente Geral do Investe Recife",
    image: "/images/team/ger-ronnie.jpeg",
    imagePosition: "object-top",
  },
  {
    name: "Ben-Hur Beltrão",
    role: "Gestor de Inovação",
    image: "/images/team/gest-inov-benhur.avif",
  },
  {
    name: "Hugo Borba",
    role: "Gerente de Estudos Econômicos",
    image: "/images/team/hugo-borba.jpeg",
    imagePosition: "object-top",
  },
];

// Equipe de tecnologia e design
const lastSectionMembers: TeamMember[] = [
  {
    name: "Brenno França",
    role: "Desenvolvedor Full Stack",
    image: "/images/team/dev-brenno.avif",
  },
  {
    name: "Italo Correia",
    role: "Desenvolvedor Full Stack",
    image: "/images/team/dev-italo.avif",
  },
  {
    name: "Rhuanderson Iago",
    role: "Designer UI/UX",
    image: "/images/team/design-rhuan.avif",
  },
  {
    name: "Rodrigo Andrade",
    role: "Desenvolvedor Full Stack",
    image: "/images/team/dev-rodrigo.avif",
  },
  {
    name: "Thiago Silva",
    role: "Desenvolvedor Full Stack",
    image: "/images/team/dev-thiago.avif",
  },
];

export default function TeamPage() {
  return (
    <>
      <ObsHeader />
      <NavBarHome simple />

      <section className="relative min-h-screen bg-gradient-to-b dark:bg-[#0C1B2B] px-6 py-16">
        <svg
          className="absolute top-0 left-0 w-full pointer-events-none fill-blue-50 dark:fill-[#0c2136]"
          viewBox="0 0 1440 320"
        >
          <path fillOpacity="1" d="M0,64L1440,192L1440,0L0,0Z" />
        </svg>

        {/* Título e descrição */}
        <div className="relative z-10 text-center w-full flex flex-col items-center mb-12">
          <div className="w-20 flex hover:rotate-45 transition-transform">
            <img
              src="/images/logos/observatorio_logo.png"
              alt="Logo Observatório"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white">
            Conheça Nossa Equipe
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Pessoas dedicadas em construir o futuro com inovação e colaboração.
          </p>
        </div>

        {/* Membros destacados */}
        {highlightedMembers.map((member, index) => (
          <HighlightSection key={index} {...member} />
        ))}

        {/* Grid com outros membros */}
        <TeamGrid members={teamMembers} />
      </section>

      {/* Última Seção: Equipe de Tecnologia & Design */}
      <TechnologyDesignSection lastSectionMembers={lastSectionMembers} />

      {/* Rodapé */}
      <Footer />
    </>
  );
}
