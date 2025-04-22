import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

export const useNoteReading = (notes: string[]) => {
  const [randomNote, setRandomNote] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [buttonNotes, setButtonNotes] = useState<string[]>([]);

  const playSound = async (note: string) => {
    let sound: Audio.Sound | undefined;

    try {
      const soundFile = sounds[note.toLowerCase()];
      if (!soundFile) {
        console.warn(`No sound file found for note: ${note}`);
        return;
      }

      const { sound: createdSound } = await Audio.Sound.createAsync(soundFile);
      sound = createdSound;
      await sound.playAsync();

      // Wait for the sound to finish playing and release resources
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound?.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      if (sound) {
        await sound.unloadAsync(); // Ensure resources are released in case of an error
      }
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

  const generateNoteChallenge = (level: number): { correctAnswer: string; options: string[] } => {
    const correctNote = notes[Math.floor(Math.random() * notes.length)];
    const correctAnswer = correctNote; // Declare and initialize correctAnswer
    const correctNoteLetter = correctNote[0].toLowerCase();
  
    const uniqueLetters = new Set<string>();
    uniqueLetters.add(correctNoteLetter);
  
    const filteredNotes = notes.filter(
      (n) => !uniqueLetters.has(n[0].toLowerCase()) && n !== correctNote
    );
  
    const selectedNotes: string[] = [];
    for (const note of filteredNotes) {
      const noteLetter = note[0].toLowerCase();
      if (!uniqueLetters.has(noteLetter)) {
        selectedNotes.push(note);
        uniqueLetters.add(noteLetter);
      }
      if (selectedNotes.length === 3) break;
    }
  
    const rawOptions = [...selectedNotes, correctNote].sort(() => 0.5 - Math.random());
  
    return {
      correctAnswer,
      options: rawOptions, // Return unformatted options
    };
  };

  const regenerateNote = async (setChallenge?: (challenge: { correctAnswer: string; options: string[] }) => void) => {
    const { correctAnswer, options } = generateNoteChallenge(1); // Pass the level if needed
    setRandomNote(correctAnswer);
    await playSound(correctAnswer);
    setButtonNotes(options);
    setSelectedNote(null);
    setIsChecking(true);
  
    // If a callback is provided, update the challenge in the component
    if (setChallenge) {
      setChallenge({ correctAnswer, options });
    }
  };

  const handleCheckAnswer = async () => {
    const isCorrect = selectedNote === randomNote;
    setIsChecking(false);
  };

  return {
    randomNote,
    buttonNotes,
    selectedNote,
    setSelectedNote,
    isChecking,
    regenerateNote,
    handleCheckAnswer,
    playSound,
    generateNoteChallenge,
  };
};
