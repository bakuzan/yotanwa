import defaultUserOptions from '../consts/defaultUserOptions';

function converter(value) {
  if (!value) {
    return null;
  }

  const val = unescape(value);
  if (!val.includes(',')) {
    return JSON.parse(val);
  }

  const isNested = val.includes('|');

  return val.split(',').map((x) => {
    if (isNested) {
      const [s, r] = x.split('|');
      return [Number(s), r];
    } else {
      return Number(x);
    }
  });
}

export default function processCookies(cks = '') {
  const cookies = cks.split('; ').filter((x) => !!x);

  const userValues = cookies
    .map((c) => c.split('='))
    .filter(([key]) => key in defaultUserOptions)
    .reduce(
      (p, [k, v]) => ({
        ...p,
        [k]: converter(v)
      }),
      {}
    );

  return { ...defaultUserOptions, ...userValues };
}
