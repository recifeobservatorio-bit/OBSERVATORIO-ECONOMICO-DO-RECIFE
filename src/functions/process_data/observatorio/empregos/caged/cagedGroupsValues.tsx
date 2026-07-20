const IGNORED_GROUP_LABELS = new Set(["não informado", "nao informado", "undefined", "null", ""]);

export const processGroupsValues = (data: any[], group: string) => {
    const objData = data.reduce((acc, obj) => {
        const key = obj[group]

        if (key === undefined || key === null) return acc
        // Descarta valores inválidos: rótulos "não informado" e textos de rodapé/observação
        // que às vezes vêm misturados nos dados brutos (ex: notas de rodapé de planilha).
        if (typeof key === "string" && (key.length > 60 || IGNORED_GROUP_LABELS.has(key.trim().toLowerCase()))) return acc

        if (!acc[key]) {
            acc[key] = 0
        }

        acc[key] += obj['Saldos']

        return acc
    } , {})

    return Object.entries(objData).map(([label, value]) => ({ label, value })).sort((a, b) => (b.value as number) - (a.value as number))
}