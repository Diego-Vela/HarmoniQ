import { useMedalStore } from '@/stores/useMedalStore';

export const isHigherScoreOrAccuracy = (trial: string, score: number, accuracy: number): boolean => {
  const { medals } = useMedalStore.getState();

  const savedMedal = medals[trial];

  if (!savedMedal) {
    return true;
  }

  // Compare score and accuracy
  if (score > savedMedal.score) {
    return true;
  } else if (score === savedMedal.score && accuracy > savedMedal.accuracy) {
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

  // Check if the new score or accuracy is higher
  const isHigher = isHigherScoreOrAccuracy(trial, score, accuracy);

  if (!isHigher) {
    return { medal: 'None', nextRequirements: 'Your score or accuracy did not improve.' };
  }

  if (score >= 45 && accuracy >= 95) {
    return { medal: 'Platinum', nextRequirements: 'You have mastered this category!' };
  } else if (score >= 30 && accuracy >= 90) {
    return { medal: 'Gold', nextRequirements: 'Platinum at 45 Correct 95% Accuracy' };
  } else if (score >= 25 && accuracy >= 80) {
    return { medal: 'Silver', nextRequirements: 'Gold at 30 Correct 90% Accuracy' };
  } else if (score >= 20 && accuracy >= 70) {
    return { medal: 'Bronze', nextRequirements: 'Silver at 25 Correct 80% Accuracy' };
  } else {
    return { medal: 'None', nextRequirements: 'Pass with 20 Correct and 70% Accuracy' };
  }
};

// Internal function to parse score and accuracy strings
const parseScoreAndAccuracy = (scoreString: string, accuracyString: string): { score: number; accuracy: number } => {
  const score = parseInt(scoreString.split('/')[0], 10); // Extract the first number before '/'
  const accuracy = parseInt(accuracyString.replace('%', ''), 10); // Remove '%' and convert to number
  return { score, accuracy };
};