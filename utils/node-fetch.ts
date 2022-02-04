import type { RequestInit } from 'node-fetch';

export default async function fetch(
  url: string,
  options?: RequestInit | undefined
) {
  return await import('node-fetch').then(({ default: nodeFetch }) =>
    nodeFetch(url, options)
  );
}
