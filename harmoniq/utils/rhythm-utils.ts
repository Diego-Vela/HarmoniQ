import rhythmsData from '@/constants/rhythms.json';

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
