import rhythmsData from '@/data/activities/rhythms.json';

interface RhythmPattern {
  pattern: string[];
  beats: number;
}

interface RhythmLevels {
  [level: string]: RhythmPattern[];
}

interface RhythmData {
  [category: string]: RhythmLevels;
}

const rhythms = rhythmsData as RhythmData;

export const selectRandomRhythm = (
  category: string,
  level: string
): RhythmPattern | null => {
  const rhythmsForLevel = rhythms[category]?.[level];
  if (!rhythmsForLevel || rhythmsForLevel.length === 0) {
    console.error(`No rhythms found for category "${category}" and level "${level}".`);
    return null;
  }
  const randomIndex = Math.floor(Math.random() * rhythmsForLevel.length);
  return rhythmsForLevel[randomIndex];
};

export function compareRhythm(
  userTimestamps: number[],
  targetRhythm: string[],
  startTime: number | null,
  tempo = 100, // Beats per minute
  tolerance = 215, // Allowed error in milliseconds
  calibrationOffset = 0 // Adjustment for user calibration
): boolean {
  if (!startTime || userTimestamps.length !== targetRhythm.length) {
    // console.log('Mismatch in rhythm length or invalid start time.');
    return false;
  }

  const quarter = 60000 / tempo; // Duration of a quarter note in milliseconds

  // Helper function to calculate the duration of a note
  const noteToDelay = (note: string): number => {
    switch (note) {
      case 'q': return quarter; // Quarter note
      case '8': return quarter / 2; // Eighth note
      case 'h': return quarter * 2; // Half note
      default: return quarter; // Default to quarter note
    }
  };

  // Build expected timestamps relative to startTime
  const expectedTimestamps: number[] = [];
  let timeOffset = 0;

  for (let i = 0; i < targetRhythm.length; i++) {
    expectedTimestamps.push(startTime + timeOffset);
    timeOffset += noteToDelay(targetRhythm[i]);
  }

  // Calculate offsets and check tolerance
  const offsets: number[] = [];
  let isWithinTolerance = true;

  for (let i = 0; i < targetRhythm.length; i++) {
    const actual = userTimestamps[i];
    const expected = expectedTimestamps[i] + calibrationOffset;
    const offset = actual - expected;

    offsets.push(offset);
    // console.log(`Beat ${i + 1}: Actual=${actual}, Expected=${expected}, Offset=${offset}ms`);

    // Check if the offset is within the tolerance
    if (Math.abs(offset) > tolerance) {
      //console.log(`Beat ${i + 1} is outside tolerance: ${Math.abs(offset)}ms > ${tolerance}ms`);
      isWithinTolerance = false;
    }
  }

  // Calculate and log the average offset
  const averageOffset = offsets.reduce((sum, offset) => sum + offset, 0) / offsets.length;
  // console.log(`Average Offset: ${averageOffset.toFixed(2)}ms`);

  return isWithinTolerance; // Return whether all beats are within tolerance
}

