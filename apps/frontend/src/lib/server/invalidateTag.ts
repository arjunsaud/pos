'use server';

import { revalidateTag } from 'next/cache';

export default async function invalidateTag(tag: string) {
  return revalidateTag(tag, 'max');
}
