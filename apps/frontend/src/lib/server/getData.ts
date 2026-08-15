'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BASE_URL } from '../configs';

export type ResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  _metadata: {
    pagination: {
      total: number;
      limit: number;
      page: number;
      totalPage: number;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
};

export default async function getData<T extends object>(
  url: RequestInfo,
  provideTags?: Array<string>,
  options?: RequestInit,
): Promise<ResponseType<T> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  const optionWithProvideTag = provideTags
    ? { ...options, next: { tags: provideTags } }
    : options;

  const request = new Request(`${BASE_URL}${url}`, optionWithProvideTag);
  request.headers.set('Authorization', `Bearer ${token}`);

  try {
    const res = await fetch(request);
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as ResponseType<T>;
  } catch (err) {
    console.error('Server `fetch` error', err);
    return null;
  }
}
