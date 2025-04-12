export function getXPForLevel(level: number): number {
  return Math.round(10 + (level - 1) * 5);
}
