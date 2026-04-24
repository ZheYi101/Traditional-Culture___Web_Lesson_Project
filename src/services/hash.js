export function createStableHash(input) {
  const source = String(input || "");
  let hashValue = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hashValue ^= source.charCodeAt(index);
    hashValue = Math.imul(hashValue, 16777619);
  }

  return Math.abs(hashValue >>> 0);
}

export function mapHashToRange(hashValue, min, max) {
  const rangeSize = max - min + 1;
  return min + (hashValue % rangeSize);
}
