import Cookie from 'js-cookie';
import { auth } from '@/lib/configs/auth';
import { BASE_URL } from '@/lib/configs';

const TOKEN_KEY = 'posnepal.accessToken';
const AUTH_KIND_KEY = 'posnepal.authKind';
const API_BASE_URL = BASE_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message ?? extractApiMessage(body) ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
  }
}

export function extractApiMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') {
    return undefined;
  }
  const payload = body as Record<string, unknown>;
  const message = payload.message;
  if (typeof message === 'string') {
    return message;
  }
  if (Array.isArray(message) && typeof message[0] === 'string') {
    return message[0];
  }
  return undefined;
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return Cookie.get('accessToken') ?? null;
  }
  return Cookie.get('accessToken') ?? window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null, kind?: 'admin' | 'user'): void {
  if (token) {
    auth.login(token, kind);
  } else {
    auth.logout();
  }
}

export function getAuthKind(): 'admin' | 'user' | null {
  if (typeof window === 'undefined') {
    const kind = Cookie.get('authKind');
    return kind === 'admin' || kind === 'user' ? kind : null;
  }
  const kind =
    Cookie.get('authKind') ?? window.localStorage.getItem(AUTH_KIND_KEY);
  return kind === 'admin' || kind === 'user' ? kind : null;
}

export function setAuthKind(kind: 'admin' | 'user' | null): void {
  if (kind) {
    Cookie.set('authKind', kind, { path: '/' });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_KIND_KEY, kind);
    }
  } else {
    Cookie.remove('authKind', { path: '/' });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_KIND_KEY);
    }
  }
}

export function normalizeRecord<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeRecord(item)) as T;
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const raw = value as Record<string, unknown>;
  const id = raw._id ?? raw.id;
  const createdAtValue = raw.createdAt;
  let createdAt = raw.createdAt;
  if (createdAtValue instanceof Date) {
    createdAt = createdAtValue.toISOString().slice(0, 10);
  } else if (typeof createdAtValue === 'string' && createdAtValue.length >= 10) {
    createdAt = createdAtValue.slice(0, 10);
  }

  const next: Record<string, unknown> = { ...raw };
  delete next._id;
  if (id !== undefined && id !== null) {
    next.id = String(id);
  }
  if (createdAt !== undefined) {
    next.createdAt = createdAt;
  }
  if (next.canExport !== undefined && next.export === undefined) {
    next.export = next.canExport;
  }
  if (typeof next.fullName === 'string' && next.name === undefined) {
    next.name = next.fullName;
  }
  if (typeof next.mobileNumber === 'string' && next.phone === undefined) {
    next.phone = next.mobileNumber;
  }
  if (next.isActive !== undefined && next.status === undefined) {
    next.status = next.isActive ? 'active' : 'inactive';
  }
  if (typeof next.createdAt === 'string' && next.timestamp === undefined) {
    next.timestamp = raw.createdAt ?? next.createdAt;
  }

  return next as T;
}

export function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return normalizeRecord((payload as { data: T }).data);
  }
  return normalizeRecord(payload as T);
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    auth?: boolean;
  } = {},
): Promise<T> {
  const { method = 'GET', body, query, auth = true } = options;
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (response.status === 401 && typeof window !== 'undefined') {
    auth.logout();
    window.dispatchEvent(new Event('posnepal:unauthorized'));
  }

  if (!response.ok) {
    throw new ApiError(response.status, payload);
  }

  return unwrapData<T>(payload);
}
