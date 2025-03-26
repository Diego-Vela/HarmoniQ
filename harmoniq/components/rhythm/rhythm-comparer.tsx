export function compareRhythm(
  userTimestamps: number[],
  targetRhythm: string[],
  startTime: number | null,
  tempo = 100,
  tolerance = 350 // milliseconds of error allowed
): boolean {
  if (!startTime || userTimestamps.length !== targetRhythm.length) return false;

  const quarter = 60000 / tempo;

  const noteToDelay = (note: string): number => {
    switch (note) {
      case 'q': return quarter;
      case '8': return quarter / 2;
      case 'h': return quarter * 2;
      default: return quarter;
    }
  };

  // Build expected timestamps relative to startTime
  const expectedTimestamps: number[] = [];
  let timeOffset = 0;

  for (let i = 0; i < targetRhythm.length; i++) {
    expectedTimestamps.push(startTime + timeOffset);
    timeOffset += noteToDelay(targetRhythm[i]);
  }

  // Compare user taps with expected beats
  for (let i = 0; i < targetRhythm.length; i++) {
    const actual = userTimestamps[i];
    const expected = expectedTimestamps[i];

    if (Math.abs(actual - expected) > tolerance) {
      return false;
    }
  }

  return true;
}
