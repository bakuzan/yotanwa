// import fetch from 'node-fetch';
import getErrorMessage from './getErrorMessage';

function setOptions(method: string, body: any) {
  const bodyProps = !body
    ? {}
    : {
        body: typeof body === 'string' ? body : JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      };

  return {
    method,
    ...bodyProps
  };
}

export default async function fetchYTW<T = any>(
  url: string,
  method = 'GET',
  body = null
): Promise<T | { success: false; error: string }> {
  const options = setOptions(method, body);

  try {
    const response = await fetch(url, options);

    return (await response.json()) as T;
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}
