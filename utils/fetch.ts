import fetch from 'node-fetch';

function setOptions(method: string, body: any) {
  return {
    method,
    body: !!body ? JSON.stringify(body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
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
    return { success: false, error };
  }
}
