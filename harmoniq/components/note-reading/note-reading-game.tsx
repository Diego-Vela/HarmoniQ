import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNoteReading } from '@/hooks/useNoteReading'; // Your custom hook
import SimpleNotes from '@/components/buttons/simple-notes';
import ActivityBase from '@/components/activity-base';

type NoteReadingGameProps = {
  clefName: 'Treble' | 'Bass';
  notes: string[];
  noteImages: Record<string, any>; // Replace `any` with correct type if you have one
};

const NoteReadingGame: React.FC<NoteReadingGameProps> = ({ clefName, notes, noteImages }) => {
  const {
    randomNote,
    selectedNote,
    setSelectedNote,
    resultMessage,
    isChecking,
    regenerateNote,
    handleCheckAnswer,
    buttonNotes,
    playSound,
  } = useNoteReading(notes);

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note);
      await playSound(note);
    }
  };

  return (
    <ActivityBase description={`Select the correct note for the ${clefName} clef`}>
      {/* Display Note */}
      <View className="bg-transparent w-[80%] h-[35%] items-center justify-center relative">
        {randomNote && (
          <>
            <Image
              source={noteImages[randomNote]}
              className="w-[90%] h-[50%] z-0"
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

      {/* Buttons */}
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
            onPress={() => (isChecking ? handleCheckAnswer() : regenerateNote())}
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

export default NoteReadingGame;
