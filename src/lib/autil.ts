export function reversed<T>(i: T[]): T[] {
  return i.map((e, i, a)=> a[(a.length -1) -i]);
}