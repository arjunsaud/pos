import { apiRequest, apiUpload } from './client';

export function resourceApi(basePath: string) {
  return {
    list: <T>(query?: Record<string, string | number | boolean | undefined>) =>
      apiRequest<T>(`${basePath}/list`, { query }),
    get: <T>(id: string) => apiRequest<T>(`${basePath}/get/${id}`),
    create: <T>(body: unknown) =>
      apiRequest<T>(`${basePath}/create`, { method: 'POST', body }),
    update: <T>(id: string, body: unknown) =>
      apiRequest<T>(`${basePath}/update/${id}`, { method: 'PATCH', body }),
    active: <T>(id: string) =>
      apiRequest<T>(`${basePath}/update/active/${id}`, { method: 'PATCH' }),
    inactive: <T>(id: string) =>
      apiRequest<T>(`${basePath}/update/inactive/${id}`, { method: 'PATCH' }),
    remove: <T>(id: string) =>
      apiRequest<T>(`${basePath}/delete/${id}`, { method: 'DELETE' }),
  };
}

export {
  apiRequest,
  apiUpload,
  ApiError,
  setAccessToken,
  getAccessToken,
  setAuthKind,
  getAuthKind,
  unwrapData,
  extractApiMessage,
} from './client';
export { apiPaths } from './endpoints';
