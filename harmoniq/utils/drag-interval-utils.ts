export const generateIntervalRound = () => {
  const rootNote = 'C4'; // can randomize
  const interval = 'P5'; // can randomize from allowed set
  const isHigher = Math.random() > 0.5;
  const comparisonNote = isHigher ? 'G4' : 'F3'; // depending on interval logic
  return { rootNote, comparisonNote, isHigher, interval };
};
