const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function createRestApi<T extends { id: string }>(resource: string) {
  const base = `/api/${resource}`;
  return {
    getAll: (): Promise<T[]> =>
      request<T[]>(base),

    add: (item: Omit<T, 'id'>): Promise<T> =>
      request<T>(base, { method: 'POST', body: JSON.stringify(item) }),

    update: (id: string, data: Partial<T>): Promise<void> =>
      request<void>(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string): Promise<void> =>
      request<void>(`${base}/${id}`, { method: 'DELETE' }),
  };
}
