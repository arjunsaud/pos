import type { SearchParams } from '../types/interface/searchParams.interface';

export default async function parseSearchParams<T extends SearchParams>(
  searchParams: T,
): Promise<string> {
  const params = new URLSearchParams();
  const page = String(searchParams.page ?? '1');
  const limit = String(searchParams.limit ?? '20');
  params.set('page', page);
  params.set('limit', limit);
  if (typeof searchParams.search === 'string' && searchParams.search) {
    params.set('search', searchParams.search);
  }
  if (typeof searchParams.searchBy === 'string' && searchParams.searchBy) {
    params.set('searchBy', searchParams.searchBy);
  } else {
    params.set('searchBy', 'name,phone,email,title');
  }
  return `/?${params.toString()}`;
}
