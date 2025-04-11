import { useEffect, useState, useMemo } from 'react';
import  intervalLevels  from '@/data/interval-levels.json';
import { playTone } from '@/utils/play-tone-utils'; // Adjust path as needed


export type Interval =
  | 'M2' | 'm3' | 'M3'
  | 'P4' | 'P5'
  | 'M6' | 'm7' | 'M7'
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
    M2: 2,
    m3: 3,
    M3: 4,
    P4: 5,
    P5: 7,
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


// Define the LevelData type
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
} {
  const [currentInterval, setCurrentInterval] = useState<Interval>('M2');
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(null);
  const [currentRoot, setCurrentRoot] = useState('C');
  const [isChecking, setIsChecking] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [visibleFeedback, setVisibleFeedback] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true); // Track if it's the first load

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const playInterval = async () => {
    const rootMidi = noteToMidi[currentRoot as Note];
    const intervalSemis = intervalToSemitones[currentInterval];
    const secondMidi = rootMidi + intervalSemis;

    if (!rootMidi || !secondMidi) {
      console.log(`Invalid MIDI notes: rootMidi=${rootMidi}, secondMidi=${secondMidi}`);
      return;
    }

    // console.log('Playing interval:', currentInterval);

    await playTone(rootMidi);
    await delay(600);
    await playTone(secondMidi);
  };

  const checkAnswer = () => {
    if (!selectedInterval) {
      // console.warn('No interval selected.');
      return;
    }

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
    await delay(400); // shorter delay than full question playback
    await playTone(secondMidi);
  };

  const generateNext = () => {
    if (!levelData) {
      // console.log(`Level ${level} not in intervalLevels.`);
      return;
    }

    const { rootNotes, intervals } = levelData;
    const newRoot = rootNotes[Math.floor(Math.random() * rootNotes.length)];
    const newInterval = intervals[Math.floor(Math.random() * intervals.length)];

    // console.log('Generated interval:', newInterval);

    setCurrentRoot(newRoot as Note);
    setCurrentInterval(newInterval as Interval);
    setSelectedInterval(null);
    setIsChecking(true);
    setVisibleFeedback(false);
  };

  // Play the interval whenever currentRoot or currentInterval changes
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false); // Prevent further calls on subsequent renders
      return;
    }

    if (isChecking && currentRoot && currentInterval) {
      playInterval();
    }
  }, [currentRoot, currentInterval, isChecking]);

  // Generate the first exercise when the screen loads
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
  };
}
