import { Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';
import { SafeAreaView } from 'react-native-safe-area-context';
import AllNotes from "@/components/buttons/all-notes";
import AllAccidentals from "@/components/buttons/all-accidentals";
import AllQuality from "@/components/buttons/all-quality";
import { trebleClefNotes } from '@/constants/music-notes';
import { images } from '@/constants/images';

type Note = 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'a4' | 'b4';

const notes: Note[] = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4'];
const accidentals = ['♯', '♭', '♮', '𝄪', '𝄫'];
const quality = ['Major', 'Minor', 'Diminished', 'Augmented', 'Perfect'];

const getRandomNote = (): Note => {
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

const NoteReading = () => {
  const [randomNote, setRandomNote] = useState<Note | null>(null);

  const playSound = async (soundFile: any) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const handleGenerateNote = async () => {
    const note = getRandomNote();
    setRandomNote(note); // Set the random note

    // Play the sound for the generated note
    const noteKey = note.toLowerCase().replace('4', '') as keyof typeof sounds;
    await playSound(sounds[noteKey]);
  };

  const handleReplayNote = async () => {
    if (randomNote) {
      const noteKey = randomNote.toLowerCase().replace('4', '') as keyof typeof sounds;
      await playSound(sounds[noteKey]);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-dark-100">
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
              source={trebleClefNotes[randomNote]} // Dynamically select the image
              className="w-[90%] h-[50%] z-0 rounded-3xl"
              resizeMode="contain"
            />
            {/* Replay Note Button */}
            <TouchableOpacity
              className="flex items-center justify-center mt-10 w-[30%] h-[20%] bg-blue-500 rounded-full px-4 py-2"
              onPress={handleReplayNote}
            >
              <Text className="text-white font-bold text-center">Replay Note</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Buttons Container */}
      <View className="flex-col bg-primary rounded-xl border w-[80%] h-[50%] items-center justify-evenly">
        {/* Generate Random Note Button */}
        <TouchableOpacity
          className="w-[50%] h-[10%] bg-green-500 rounded-xl items-center justify-center"
          onPress={handleGenerateNote}
        >
          <Text className="text-white font-bold">Generate Note</Text>
        </TouchableOpacity>

        {/* AllNotes Component */}
        <AllNotes notes={notes.map(note => note.toUpperCase())} selectedNote={null} setSelectedNote={() => {}} />

        {/* AllAccidentals Component */}
        <AllAccidentals
          accidentals={accidentals}
          selectedAccidental={null}
          setSelectedAccidental={() => {}}
        />

        {/* AllQuality Component */}
        <AllQuality
          quality={quality}
          selectedQuality={null}
          setSelectedQuality={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default NoteReading;
