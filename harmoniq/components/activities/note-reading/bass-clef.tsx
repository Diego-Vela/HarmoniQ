import React from 'react';
import NoteReadingGame from '@/app/(lessons)/note-reading/note-reading-game';
import noteData from '@/data/note-identification.json';
import { bassClefNotes } from '@/constants/music-notes-bass';
import { useLocalSearchParams } from 'expo-router';

const BassClefGame = () => {
  const { level } = useLocalSearchParams();

  // Dynamically load bass clef notes for the specified level
  const bassNotes = noteData.levels.bass[level as keyof typeof noteData.levels.bass];
  console.log(bassNotes);

  if (!bassNotes) {
    console.error(`Invalid level "${level}" for bass clef.`);
    return null; // Render nothing if the level is invalid
  }

  return (
    <NoteReadingGame
      clefName="Bass"
      notes={bassNotes}
      noteImages={bassClefNotes}
      level={parseInt(level as string)}
      onSuccess={() => console.log('Bass training complete')} // Replace with mission success logic later
    />
  );
};

export default BassClefGame;
