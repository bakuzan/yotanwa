import fetch from 'node-fetch';

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

export default async function fetchYTW(
  url: string,
  method = 'GET',
  body = null
) {
  const options = setOptions(method, body);

  try {
    const response = await fetch(url, options);

    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
