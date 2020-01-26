export default function distinct<T = any>(
  arr: T[],
  fn: (a: T, b: T) => boolean
) {
  return arr.filter((x, i, a) => a.findIndex((y) => fn(x, y)) === i);
}
