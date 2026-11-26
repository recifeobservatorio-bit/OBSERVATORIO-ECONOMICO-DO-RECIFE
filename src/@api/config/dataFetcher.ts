import { getFromIndexedDB, listIndexedDBKeys, saveToIndexedDB } from "@/@api/cache/indexDB";

import { readParquetFromBuffer } from "./parquetReader";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetchData<T>(
  endpoint: string,
  cache: Record<string, any>
): Promise<T> {

  if (cache[endpoint]) {
    console.log("Usando cache para:", endpoint);
    return cache[endpoint];
  }

  const filename = endpoint;
  const cachedBuffer = await getFromIndexedDB("parquetDB", "parquetFiles", filename);

  let data: T;

  if (cachedBuffer) {
    console.log("Lendo de cache IndexedDB:", filename);
    data = await readParquetFromBuffer(cachedBuffer);  // Usando o parquetReader
  } else {
    console.log("Fetch remoto para:", endpoint);
    // /api/data/** é público no back-end (SecurityConfig: permitAll) — sem login/senha.
    const response = await fetch(`${BASE_URL}${endpoint}`, { method: "GET" });

    if (!response.ok) {
      throw new Error(`Erro ao buscar: ${endpoint}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/octet-stream")) {
      const buffer = await response.arrayBuffer();
      data = await readParquetFromBuffer(buffer);  // Usando o parquetReader
      await saveToIndexedDB("parquetDB", "parquetFiles", filename, buffer);
    } else {
      const text = await response.text();
      data = JSON.parse(text);
    }
  }

  cache[endpoint] = data;
  return data;
}
