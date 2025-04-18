import React from 'react';
import NoteReadingGame from '@/components/note-reading/note-reading-game';
import noteData from '@/data/note-identification.json';
import { trebleClefNotes } from '@/constants/music-notes-treble';
import { useLocalSearchParams } from 'expo-router';


const TrebleClefGame = () => {
  const { level } = useLocalSearchParams();

  const trebleNotes = noteData.levels.treble[level as keyof typeof noteData.levels.treble];
  console.log(trebleNotes);

  if (!trebleNotes) {
    console.error(`Invalid level "${level}" for treble clef.`);
    return null; // Render nothing if the level is invalid
  }

  return (
    <NoteReadingGame
      clefName="Treble"
      notes={trebleNotes}
      noteImages={trebleClefNotes} 
    />
  );
};

export default TrebleClefGame;
