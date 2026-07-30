export const processEmpresasMonthInfo = (data: any) => {
    const sorted = [...data].sort((a: any, b: any) => a['mes'] - b['mes'])

    return sorted.map((dataMap: any) => {
        // Busca o mês anterior pelo valor de 'mes', não pela posição no array — a tabela
        // deve mostrar a variação real mesmo que o array não comece em Janeiro (ex: filtro de mês aplicado).
        const mesAnterior = sorted.find((item: any) => item['mes'] === dataMap['mes'] - 1)

        if (mesAnterior) {
           return { mes: dataMap['mes'], empresas: dataMap['Empresas Ativas'], variacao: (((dataMap['Empresas Ativas'] - mesAnterior['Empresas Ativas']) / mesAnterior['Empresas Ativas']) * 100).toFixed(2) }
        }
        return { mes: dataMap['mes'], empresas: dataMap['Empresas Ativas'], variacao: 0}
    })
}

