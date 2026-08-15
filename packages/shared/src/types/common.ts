export type Id = string;

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface MoneyAmount {
  amount: number;
  currency: string;
}

export interface NetworkInfo {
  status: 'ONLINE' | 'OFFLINE' | 'UNKNOWN';
  type?: string;
  checkedAt: string;
}
