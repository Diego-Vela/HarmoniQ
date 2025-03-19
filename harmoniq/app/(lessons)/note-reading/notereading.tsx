import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import ActivityBase from '@/components/activity-base'; // Import the reusable component
import SimpleNotes from '@/components/buttons/simple-notes';
import { trebleClefNotes } from '@/constants/music-notes';
import { sounds } from '@/constants/sounds';

type Note = 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'a4' | 'b4';

const notes: Note[] = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'];

const NoteReading = () => {
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [buttonNotes, setButtonNotes] = useState<Note[]>([]);

  const playSound = async (note: string) => {
    try {
      const noteKey = note.toLowerCase().replace('4', '') as keyof typeof sounds;
      const { sound } = await Audio.Sound.createAsync(sounds[noteKey]);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const getRandomNote = (): Note => {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
  };

  const generateButtonNotes = (randomNote: Note): Note[] => {
    const otherNotes = notes.filter((note) => note !== randomNote);
    const shuffledNotes = otherNotes.sort(() => Math.random() - 0.5);
    const selectedNotes = shuffledNotes.slice(0, 3);
    return [...selectedNotes, randomNote].sort(() => Math.random() - 0.5);
  };

  const handleGenerateNote = async () => {
    const note = getRandomNote();
    setRandomNote(note);

    const noteKey = note.toLowerCase().replace('4', '') as keyof typeof sounds;
    await playSound(noteKey);

    const newButtonNotes = generateButtonNotes(note);
    setButtonNotes(newButtonNotes);
  };

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note);
      await playSound(note);
    }
  };

  const handleCheckAnswer = () => {
    if (isChecking) {
      if (!selectedNote) {
        setResultMessage('Please select a note before checking your answer.');
        return;
      }

      if (selectedNote === randomNote) {
        setResultMessage(`Correct! You selected the correct note: ${selectedNote.toUpperCase()}`);
      } else {
        setResultMessage(`Incorrect! The correct note was: ${randomNote?.toUpperCase()}`);
      }

      setIsChecking(false);
    } else {
      handleGenerateNote();
      setSelectedNote(null);
      setResultMessage('');
      setIsChecking(true);
    }
  };

  useEffect(() => {
    handleGenerateNote();
  }, []);

  return (
    <ActivityBase>
      {/* Display Random Note */}
      <View className="bg-transparent w-[80%] h-[35%] items-center justify-center relative">
        {randomNote && (
          <>
            <Image
              source={trebleClefNotes[randomNote]}
              className="w-[90%] h-[50%] z-0 rounded-2xl"
              resizeMode="contain"
            />
            <TouchableOpacity
              className="flex items-center justify-center mt-10 w-[30%] h-[20%] bg-secondary border-2 rounded-full px-4 py-2"
              onPress={() => playSound(randomNote)}
            >
              <Text className="text-white font-bold text-center">Replay Note</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Buttons Container */}
      <View className="flex-col bg-primary rounded-xl border w-[80%] h-[50%] items-center justify-evenly">
        <SimpleNotes
          notes={buttonNotes}
          selectedNote={selectedNote}
          onNotePress={handleNotePress}
          disabled={!isChecking}
        />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <Text
            className={`font-bold text-center ${
              resultMessage
                ? selectedNote === randomNote
                  ? 'text-green-500'
                  : 'text-red-500'
                : 'text-transparent'
            }`}
          >
            {resultMessage || 'Enter result here'}
          </Text>
          <TouchableOpacity
            className="w-[80%] h-[50%] bg-secondary rounded-xl justify-center"
            onPress={handleCheckAnswer}
          >
            <Text className="text-white font-bold text-center">
              {isChecking ? 'Check Answer' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActivityBase>
  );
};

export default NoteReading;
