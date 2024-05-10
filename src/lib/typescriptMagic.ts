// Use this in the event of a type false positive to make TypeScript shut up.
// Useful if you're doing some form wizardry
export function _as<T>(into: string): T {
  return into as T;
}
