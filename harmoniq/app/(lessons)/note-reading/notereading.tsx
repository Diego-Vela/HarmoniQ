import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleNotes from "@/components/buttons/simple-notes";
import AllAccidentals from "@/components/buttons/all-accidentals";
import AllQuality from "@/components/buttons/all-quality";
import { trebleClefNotes } from '@/constants/music-notes';
import { images } from '@/constants/images';

type Note = 'c4' | 'd4' | 'e4' | 'f4';

const notes: Note[] = ['c4', 'd4', 'e4', 'f4'];
const accidentals = ['♯', '♭', '♮', '𝄪', '𝄫'];
const quality = ['Major', 'Minor', 'Diminished', 'Augmented', 'Perfect'];

const getRandomNote = (): Note => {
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

const NoteReading = () => {
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true); // Track whether the button is in "Check Answer" or "Continue" mode
  const [resultMessage, setResultMessage] = useState<string>(''); // Store the result message

  const playSound = async (note: string) => {
    try {
      const noteKey = note.toLowerCase().replace('4', '') as keyof typeof sounds;
      const { sound } = await Audio.Sound.createAsync(sounds[noteKey]);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note); // Update the selected note
      await playSound(note); // Play the corresponding sound
    }
  };

  const handleGenerateNote = async () => {
    const note = getRandomNote();
    setRandomNote(note);

    const noteKey = note.toLowerCase().replace('4', '') as keyof typeof sounds;
    await playSound(noteKey);
  };

  const handleCheckAnswer = () => {
    if (isChecking) {
      // Check the answer
      if (!selectedNote) {
        setResultMessage('Please select a note before checking your answer.');
        return;
      }

      if (selectedNote === randomNote) {
        setResultMessage(`Waow! Keep it up!`);
      } else {
        setResultMessage(`Ooops! We all make mistakes. Keep going!`);
      }

      // Switch to "Continue" mode
      setIsChecking(false);
    } else {
      // Regenerate a new note and reset the button
      handleGenerateNote();
      setSelectedNote(null); // Reset the selected note
      setResultMessage(''); // Clear the result message
      setIsChecking(true); // Switch back to "Check Answer" mode
    }
  };

  useEffect(() => {
    handleGenerateNote();
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-dark-200">
      {/* Background Image */}
      <Image
        source={images.bg}
        className="absolute top-0 left-0 w-full h-[35%] z-0"
        resizeMode="cover"
      />

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
        {/* SimpleNotes Component */}
        <SimpleNotes
          notes={notes}
          selectedNote={selectedNote}
          onNotePress={handleNotePress} // Pass the handler to SimpleNotes
          disabled={!isChecking} // Disable buttons when not in "Check Answer" mode
        />

        {/* Check Answer / Continue Button */}
        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          {/* Display Result Message */}
          <Text
            className={`font-bold text-center ${
              resultMessage ? 'text-white' : 'text-transparent'
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
    </SafeAreaView>
  );
};

export default NoteReading;
