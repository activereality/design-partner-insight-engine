const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClientError extends Error {
  constructor(message = 'Request failed') {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new ApiClientError();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
