import { useMedalStore } from '@/stores/useMedalStore';

export const isHigherScoreOrAccuracy = (
  trial: string,
  score: number,
  accuracy: number,
  acquiredMedal: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum',
  nextRequirements: string // Added nextRequirements parameter
): boolean => {
  const { medals, setMedal } = useMedalStore.getState(); // Access setMedal from the store
  const savedMedal = medals[trial];

  if (!savedMedal) {
    // If no medal exists, save the new score, accuracy, acquired medal, and next requirements
    setMedal(trial, { medal: acquiredMedal, score, accuracy, nextRequirements });
    return true;
  }

  // Compare score and accuracy
  if (score > savedMedal.score || (score === savedMedal.score && accuracy > savedMedal.accuracy)) {
    // Update the medal store with the new score, accuracy, acquired medal, and next requirements
    setMedal(trial, { medal: acquiredMedal, score, accuracy, nextRequirements });
    return true;
  }

  return false;
};

export const awardNoteReadingMedal = (
  trial: string,
  rawScore: string,
  rawAccuracy: string
): { medal: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum'; nextRequirements: string } => {
  const { score, accuracy } = parseScoreAndAccuracy(rawScore, rawAccuracy);

  let acquiredMedal: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  let nextRequirements: string;

  if (score >= 45 && accuracy >= 95) {
    acquiredMedal = 'Platinum';
    nextRequirements = 'You have mastered this category!';
  } else if (score >= 30 && accuracy >= 90) {
    acquiredMedal = 'Gold';
    nextRequirements = 'Platinum at 45 Correct 95% Accuracy';
  } else if (score >= 20 && accuracy >= 80) {
    acquiredMedal = 'Silver';
    nextRequirements = 'Gold at 30 Correct 90% Accuracy';
  } else if (score >= 15 && accuracy >= 70) {
    acquiredMedal = 'Bronze';
    nextRequirements = 'Silver at 25 Correct 80% Accuracy';
  } else {
    acquiredMedal = 'None';
    nextRequirements = 'Pass with 15 Correct and 70% Accuracy';
  }

  // Check if the new score or accuracy is higher and update the medal store if necessary
  const isHigher = isHigherScoreOrAccuracy(trial, score, accuracy, acquiredMedal, nextRequirements);

  return { medal: acquiredMedal, nextRequirements };
};

// Internal function to parse score and accuracy strings
const parseScoreAndAccuracy = (scoreString: string, accuracyString: string): { score: number; accuracy: number } => {
  const score = parseInt(scoreString.split('/')[0], 10); // Extract the first number before '/'
  const accuracy = parseInt(accuracyString.replace('%', ''), 10); // Remove '%' and convert to number
  return { score, accuracy };
};