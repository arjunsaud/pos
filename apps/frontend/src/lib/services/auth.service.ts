'use client';

import Cookie from 'js-cookie';
import { toast } from 'sonner';
import { auth } from '../configs/auth';
import { BASE_URL } from '../configs';

export function uploadFile(url: string, body: FormData) {
  const token = Cookie.get('accessToken');
  return fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetcher(
  url: string,
  options: RequestInit,
  isPublic?: boolean,
): Promise<Response> {
  return fetch(`${BASE_URL}${url}`, updateOptions(options, isPublic)).then(
    (res) => {
      if (res.status === 401) {
        auth.logout();
        setTimeout(() => window.location.assign('/login'), 1000);
        toast.error('Token expired. Logging out...', { duration: 1000 });
      }
      return res;
    },
  );
}

function updateOptions(options: RequestInit, isPublic?: boolean) {
  const update = { ...options };
  if (isPublic) {
    update.headers = {
      ...update.headers,
      'Content-Type': 'application/json',
    };
    return update;
  }

  const token = Cookie.get('accessToken');
  if (token) {
    update.headers = {
      ...update.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return update;
}
