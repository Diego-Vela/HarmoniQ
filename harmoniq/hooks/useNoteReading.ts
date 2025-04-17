import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

export const useNoteReading = (notes: string[]) => {
  const [randomNote, setRandomNote] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [buttonNotes, setButtonNotes] = useState<string[]>([]);

  const playSound = async (note: string) => {
    try {
      const soundFile = sounds[note.toLowerCase()];
      if (!soundFile) {
        console.warn(`No sound file found for note: ${note}`);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const getRandomNote = (): string => {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  };

  const generateButtonNotes = (correctNote: string): string[] => {
    const correctNoteLetter = correctNote[0].toLowerCase();
    const uniqueLetters = new Set<string>();
    uniqueLetters.add(correctNoteLetter);

    const filteredNotes = notes.filter((n) => !uniqueLetters.has(n[0].toLowerCase()));

    const selectedNotes: string[] = [];
    for (const note of filteredNotes) {
      const noteLetter = note[0].toLowerCase();
      if (!uniqueLetters.has(noteLetter)) {
        selectedNotes.push(note);
        uniqueLetters.add(noteLetter);
      }
      if (selectedNotes.length === 3) break;
    }

    return [...selectedNotes, correctNote].sort(() => 0.5 - Math.random());
  };

  const regenerateNote = async () => {
    const note = getRandomNote();
    setRandomNote(note);
    await playSound(note);
    setButtonNotes(generateButtonNotes(note));
    setSelectedNote(null);
    setIsChecking(true);
  };

  const handleCheckAnswer = async () => {
    const isCorrect = selectedNote === randomNote;
    setIsChecking(false);
  };

  useEffect(() => {
    regenerateNote();
  }, []);

  return {
    randomNote,
    buttonNotes,
    selectedNote,
    setSelectedNote,
    isChecking,
    regenerateNote,
    handleCheckAnswer,
    playSound,
  };
};
