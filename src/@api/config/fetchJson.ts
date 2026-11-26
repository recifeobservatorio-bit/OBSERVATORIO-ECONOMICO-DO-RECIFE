const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Busca JSON público no back-end (/api/data/** é liberado sem login no SecurityConfig).
export async function fetchJson<T>(endpoint: string, cache: Record<string, any>): Promise<T> {
  if (cache[endpoint]) {
    return cache[endpoint];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { method: "GET" });

  if (!response.ok) {
    let errorMessage = `Erro na requisição para ${endpoint} (Status: ${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = `${errorMessage}: ${errorData.message}`;
      }
    } catch (e) {}
    throw new Error(errorMessage);
  }

  const data = await response.json();
  cache[endpoint] = data;
  return data;
}
