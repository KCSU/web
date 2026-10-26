const API_ORIGIN = 'https://api.kcsu.org.uk';

const TIMEOUT_MS = 10 * 1000;

export async function fetchApi<T>(path: string): Promise<T> {
  const url = API_ORIGIN + path;
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${url} gave HTTP ${response.status}`);
  return response.json() as Promise<T>;
}
