// Recife também é o nome de um bairro (o centro histórico, "Bairro do Recife"/Recife Antigo),
// além de ser o nome da cidade — em gráficos "por bairro" isso confunde as duas coisas, então
// exibimos "Bairro do Recife" só nesse contexto (a filtragem por bairro continua usando o valor
// cru "Recife", já que é assim que vem nos dados).
export const formatBairroLabel = (bairro: string): string =>
  bairro === "Recife" ? "Bairro do Recife" : bairro;
