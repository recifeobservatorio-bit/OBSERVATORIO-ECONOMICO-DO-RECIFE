'use client'

import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import { LoadingScreen } from '@/components/home/LoadingScreen'
import { useDashboard } from '@/context/DashboardContext'
import { getMonths } from '@/utils/filters/@global/getMonths'
import { getYearSelected } from '@/utils/filters/@global/getYearSelected'

import Comparativo from './(comparativo)/comparativo'
import Desemprego from './(desemprego)/desemprego'
import Embarque from './(embarque)/embarque'
import Geral from './(geral)/geral'



const EmpregosPage = () => {
  const searchParams = useSearchParams()
  const { isLoading, data, filters } = useDashboard() as any; //tirar esse any
  const [caged, setCaged] = useState({}) as any;
  const [desemprego, setDesemprego] = useState({}) as any;
  const [activeTab, setActiveTab] = useState('geral')

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    } else if (!tab) {
      setActiveTab('geral')
      router.replace(`?tab=geral`)
    }
  }, [searchParams, activeTab, router])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (data?.caged) {
        setCaged({
          caged: data.caged.filteredData,
          municipios: data.municipios.filteredData,
          municipiosPorMes: data.municipiosPorMes ?? [],
        })

        clearInterval(intervalId)
      } else {
        setCaged({
          caged: [],
          municipios: [],
          municipiosPorMes: [],
        })
      }

      if (data?.desemprego) {
        setDesemprego({
          desemprego: data.desemprego.filteredData,
          municipios: data.municipios.filteredData,
          historico: data.historico ?? { capital: [], brasil: [] },
          trimestre: {
            municipiosTrimestre:
              data.trimestre.municipiosTrimestre.filteredData,
            municipiosTrimestrePast:
              data.trimestre.municipiosTrimestrePast.filteredData,
          },
        })

        clearInterval(intervalId)
      } else {
        setDesemprego({
          desemprego: [],
          municipios: [],
          historico: { capital: [], brasil: [] },
          trimestre: {
            municipiosTrimestre: [],
            municipiosTrimestrePast: [],
          },
        })
      }
    }, 50)

    return () => clearInterval(intervalId)
  }, [data, pathname])

  if (isLoading) return <LoadingScreen />

  const renderContent = () => {
    if (
      !data ||
      !caged.caged ||
      !caged.municipios ||
      !desemprego.desemprego ||
      !desemprego.municipios
    ) {
      return (
        <div className="text-center text-gray-600">Construindo gráficos...</div>
      )
    }

    switch (activeTab) {
      case 'geral':
        return (
          <Geral
            data={caged}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        )
      case 'comparativo':
        return <Comparativo data={caged} year={getYearSelected(filters)} />
      case 'desemprego':
        return (
          <Desemprego
            data={desemprego}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        )
      default:
        return (
          <Geral
            data={caged}
            year={getYearSelected(filters)}
            months={getMonths(filters)}
          />
        )
    }
  }

  const handleNavigation = async (tab: string) => {
    router.replace(`?tab=${tab}`)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="bi-page">
      <h1 className="bi-page-title">
        Variação e Atividade dos Empregos
      </h1>
      <div className="bi-tabs">
        {/* Botões de navegação */}
        <button
          onClick={() => handleNavigation('geral')}
          className={`bi-tab ${
            activeTab === 'geral'
              ? 'bi-tab-active'
              : ''
          }`}
        >
          Resumo Geral
        </button>
        <button
          onClick={() => handleNavigation('comparativo')}
          className={`bi-tab ${
            activeTab === 'comparativo'
              ? 'bi-tab-active'
              : ''
          }`}
        >
          Comparativo
        </button>
        <button
          onClick={() => handleNavigation('desemprego')}
          className={`bi-tab ${
            activeTab === 'desemprego'
              ? 'bi-tab-active'
              : ''
          }`}
        >
          Desemprego
        </button>
        <Link
          href={'rais?tab=geral'}
          className={`bi-tab flex items-center justify-center ${
            activeTab === 'rais'
              ? 'bi-tab-active'
              : ''
          }`}
        >
          <i>RAIS</i>
        </Link>
        <Link
          href={'micro-caged?tab=geral'}
          className={`bi-tab flex items-center justify-center ${
            activeTab === 'rais'
              ? 'bi-tab-active'
              : ''
          }`}
        >
          <i>Microdados (CAGED)</i>
        </Link>
      </div>
      {renderContent()}
    </div>
  )
}

export default EmpregosPage
