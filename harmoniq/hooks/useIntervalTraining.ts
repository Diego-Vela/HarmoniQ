import { useEffect, useState } from 'react';
import { playTone } from '@/utils/play-tone-util'; // Adjust path as needed

export type Interval =
  | 'm2' | 'M2' 
  | 'm3' | 'M3'
  | 'P4' | 'P5'
  | 'm6' | 'M6' 
  | 'm7' | 'M7'
  | 'Octave';

export type Note =
  | 'C3' | 'C#3' | 'Db3'
  | 'D3' | 'D#3' | 'Eb3'
  | 'E3'
  | 'F3' | 'F#3' | 'Gb3'
  | 'G3' | 'G#3' | 'Ab3'
  | 'A3' | 'A#3' | 'Bb3'
  | 'B3'
  | 'C4' | 'C#4' | 'Db4'
  | 'D4' | 'D#4' | 'Eb4'
  | 'E4'
  | 'F4' | 'F#4' | 'Gb4'
  | 'G4' | 'G#4' | 'Ab4'
  | 'A4' | 'A#4' | 'Bb4'
  | 'B4'
  | 'C5';

export const intervalToSemitones: Record<Interval, number> = {
  m2: 1,
  M2: 2,
  m3: 3,
  M3: 4,
  P4: 5,
  P5: 7,
  m6: 8,
  M6: 9,
  m7: 10,
  M7: 11,
  Octave: 12,
};

export const noteToMidi: Record<Note, number> = {
  C3: 48, 'C#3': 49, Db3: 49,
  D3: 50, 'D#3': 51, Eb3: 51,
  E3: 52,
  F3: 53, 'F#3': 54, Gb3: 54,
  G3: 55, 'G#3': 56, Ab3: 56,
  A3: 57, 'A#3': 58, Bb3: 58,
  B3: 59,
  C4: 60, 'C#4': 61, Db4: 61,
  D4: 62, 'D#4': 63, Eb4: 63,
  E4: 64,
  F4: 65, 'F#4': 66, Gb4: 66,
  G4: 67, 'G#4': 68, Ab4: 68,
  A4: 69, 'A#4': 70, Bb4: 70,
  B4: 71,
  C5: 72,
};

export type LevelData = {
  rootNotes: Note[];
  intervals: Interval[];
};
 
export function useIntervalTraining(level: string, levelData: LevelData): {
  currentInterval: string;
  currentRoot: string;
  selectedInterval: string | null;
  setSelectedInterval: (val: Interval | null) => void;
  isChecking: boolean;
  isCorrect: boolean;
  visibleFeedback: boolean;
  playInterval: () => Promise<void>;
  previewInterval: (interval: Interval) => Promise<void>;
  checkAnswer: () => void;
  generateNext: () => void;
  options: string[];
} {
  const [currentInterval, setCurrentInterval] = useState<Interval>('M2');
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(null);
  const [currentRoot, setCurrentRoot] = useState('C');
  const [isChecking, setIsChecking] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [visibleFeedback, setVisibleFeedback] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const playInterval = async () => {
    const rootMidi = noteToMidi[currentRoot as Note];
    const intervalSemis = intervalToSemitones[currentInterval];
    const secondMidi = rootMidi + intervalSemis;

    if (rootMidi === undefined || intervalSemis === undefined || isNaN(secondMidi)) {
      console.warn(`Invalid MIDI notes: rootMidi=${rootMidi}, secondMidi=${secondMidi}`);
      return;
    }

    await playTone(rootMidi);
    await delay(600);
    await playTone(secondMidi);
  };

  const checkAnswer = () => {
    const correct = selectedInterval === currentInterval;
    setIsCorrect(correct);
    setVisibleFeedback(true);
    setIsChecking(false);
  };

  const previewInterval = async (interval: Interval) => {
    const rootMidi = noteToMidi[currentRoot as Note];
    const intervalSemis = intervalToSemitones[interval];
    const secondMidi = rootMidi + intervalSemis;

    await playTone(rootMidi);
    await delay(400);
    await playTone(secondMidi);
  };

  const getRandomIncorrectOptions = (correctAnswer: string, options: string[]): string[] => {
    const incorrectOptions = options.filter((option) => option !== correctAnswer);
    const shuffled = incorrectOptions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const generateNext = () => {
    if (!levelData) return;

    const { rootNotes, intervals } = levelData;

    // Select a random root note from C3 to C5
    const newRoot = rootNotes[Math.floor(Math.random() * rootNotes.length)];

    // Select a random interval
    const newInterval = intervals[Math.floor(Math.random() * intervals.length)];

    setCurrentRoot(newRoot);
    setCurrentInterval(newInterval);
    setSelectedInterval(null);
    setIsChecking(true);
    setVisibleFeedback(false);

    // Generate options (correct answer + 3 incorrect options)
    const newOptions = [newInterval, ...getRandomIncorrectOptions(newInterval, intervals)];
    setOptions(newOptions.sort(() => Math.random() - 0.5));

    // Play the generated interval immediately
    const rootMidi = noteToMidi[newRoot];
    const intervalSemis = intervalToSemitones[newInterval];
    const secondMidi = rootMidi + intervalSemis;

    setTimeout(() => {
      playTone(rootMidi);
      delay(600).then(() => playTone(secondMidi));
    }, 0);
  };

  // Generate the first interval when the level loads
  useEffect(() => {
    generateNext();
  }, [level]);

  return {
    currentInterval,
    currentRoot,
    selectedInterval,
    setSelectedInterval,
    isChecking,
    isCorrect,
    visibleFeedback,
    playInterval,
    previewInterval,
    checkAnswer,
    generateNext,
    options,
  };
}
