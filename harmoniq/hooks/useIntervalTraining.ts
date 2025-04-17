import { useEffect, useState } from 'react';
import intervalLevels from '@/data/interval-levels.json';
import { playTone } from '@/utils/play-tone-util'; // Adjust path as needed

export type Interval =
  | 'm2' | 'M2' 
  | 'm3' | 'M3'
  | 'P4' | 'P5'
  | 'm6' | 'M6' 
  | 'm7' | 'M7'
  | 'Octave';

export type Note =
  | 'C' | 'C#' | 'Db'
  | 'D' | 'D#' | 'Eb'
  | 'E'
  | 'F' | 'F#' | 'Gb'
  | 'G' | 'G#' | 'Ab'
  | 'A' | 'A#' | 'Bb'
  | 'B';

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
  C: 60,
  'C#': 61, Db: 61,
  D: 62,
  'D#': 63, Eb: 63,
  E: 64,
  F: 65,
  'F#': 66, Gb: 66,
  G: 67,
  'G#': 68, Ab: 68,
  A: 69,
  'A#': 70, Bb: 70,
  B: 71,
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

    console.log(`Playing interval: root=${currentRoot}, interval=${currentInterval}`);
    console.log(`MIDI values: rootMidi=${rootMidi}, intervalSemis=${intervalSemis}, secondMidi=${secondMidi}`);

    if (rootMidi === undefined || intervalSemis === undefined || isNaN(secondMidi)) {
      console.log(`Invalid MIDI notes: rootMidi=${rootMidi}, secondMidi=${secondMidi}`);
      return;
    }

    await playTone(rootMidi);
    await delay(600);
    await playTone(secondMidi);
  };

  const checkAnswer = () => {
    if (!selectedInterval) return;

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
    const newRoot = rootNotes[Math.floor(Math.random() * rootNotes.length)];
    const newInterval = intervals[Math.floor(Math.random() * intervals.length)];

    console.log(`Generated next interval: root=${newRoot}, interval=${newInterval}`);

    setCurrentRoot(newRoot);
    setCurrentInterval(newInterval);
    setSelectedInterval(null);
    setIsChecking(true);
    setVisibleFeedback(false);

    const newOptions = [newInterval, ...getRandomIncorrectOptions(newInterval, intervals)];
    setOptions(newOptions.sort(() => Math.random() - 0.5));

    // Play the generated interval immediately
    setTimeout(() => {
      playTone(noteToMidi[newRoot]);
      delay(600).then(() => playTone(noteToMidi[newRoot] + intervalToSemitones[newInterval]));
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
