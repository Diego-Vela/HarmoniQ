import { Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from "@/constants/images";
import AllNotes from "@/components/buttons/all-notes";
import { trebleClefNotes } from '@/constants/music-notes';

type Note = 'c' | 'csharp' | 'd' | 'dsharp' | 'e' | 'f' | 'fsharp' | 'g' | 'gsharp' | 'a' | 'asharp' | 'b';

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const accidentals = ['♯', '♭', '♮', '𝄪', '𝄫'];
const quality = ['Major', 'Minor', 'Diminished', 'Augmented', 'Perfect'];

const getRandomNote = () => {
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

const NoteReading = () => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [selectedAccidental, setSelectedAccidental] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);

  const playSound = async (soundFile: any) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-evenly bg-orange-300">
      <View className="bg-white w-[80%] h-[40%] items-center justify-center">
        {/* Display selected note, accidental, and quality */}
        <Image source={images.trebleEmpty} className="absolute w-[90%] h-[50%] z-0" resizeMode="contain" />
        <Text className="text-2xl font-bold">
          {selectedNote} {selectedAccidental} {selectedQuality}
        </Text>
      </View>
      
      {/* Buttons Container */}
      <View className="flex-col bg-yellow-300 w-[80%] h-[50%] items-center justify-evenly">
        
        {/* Replace Notes with AllNotes Component */}
        <AllNotes notes={notes} selectedNote={selectedNote} setSelectedNote={setSelectedNote} />

        {/* Accidentals */}
        <View className="flex-wrap flex-row w-[90%] h-[20%] bg-orange-300 items-start justify-evenly">
          {accidentals.map(accidental => (
            <TouchableOpacity
              key={accidental}
              className={`w-[30%] h-[45%] rounded-xl items-center justify-center mt-[1%] mb-[1%] ${selectedAccidental === accidental ? 'bg-blue-500' : 'bg-gray-300'}`}
              onPress={() => setSelectedAccidental(selectedAccidental === accidental ? null : accidental)}
            >
              <Text className="text-center text-3xl">{accidental}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quality */}
        <View className="flex-wrap flex-row w-[90%] h-[20%] bg-green-300 items-start justify-evenly">
          {quality.map(quality => (
            <TouchableOpacity
              key={quality}
              className={`w-[30%] h-[45%] rounded-xl items-center justify-center mt-[1%] mb-[1%] ${selectedQuality === quality ? 'bg-blue-500' : 'bg-gray-300'}`}
              onPress={() => setSelectedQuality(selectedQuality === quality ? null : quality)}
            >
              <Text className="text-center text-base">{quality}</Text>
            </TouchableOpacity>
          ))}
        </View>
          
        {/* Play Note */} 
        <View className="w-[90%] h-[10%] bg-blue-300 items-center justify-center">
          <TouchableOpacity
            className="w-[50%] h-[100%] bg-green-300 rounded-xl border border-black items-center justify-center"
            onPress={() => {
              if (selectedNote) {
                playSound(sounds[selectedNote.toLowerCase() as Note]);
              }
            }}
          >
            <Text className="text-center text-base">Play Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NoteReading;
