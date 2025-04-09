import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNoteReading } from '@/hooks/useNoteReading'; 
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import ActivityBase from '@/components/activities/activity-base';
import Feedback from '@/components/activities/feedback'; 
import { NoteReadingGameProps } from '@/constants/types';

const NoteReadingGame: React.FC<NoteReadingGameProps> = ({
  clefName,
  notes,
  noteImages,
  level,
  onSuccess,
}) => {
  const {
    randomNote,
    selectedNote,
    setSelectedNote,
    isChecking,
    regenerateNote,
    handleCheckAnswer,
    buttonNotes,
    playSound,
  } = useNoteReading(notes);

  const [visibleFeedback, setVisibleFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // Track if the answer is correct

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note);
      await playSound(note);
    }
  };

  const handleMainButton = () => {
    console.log('isChecking:', isChecking, 'selectedNote:', selectedNote, 'randomNote:', randomNote);

    if (isChecking) {
      const isCorrect = selectedNote === randomNote;
      console.log('isCorrect:', isCorrect);
      handleCheckAnswer();
      setVisibleFeedback(true);
      setIsAnswerCorrect(isCorrect); // Track if the answer is correct
    } else {
      if (isAnswerCorrect) {
        console.log('onSuccess called');
        onSuccess(); // Call onSuccess only when the answer was correct
      } else {
        regenerateNote(); // Generate a new note if the answer was incorrect
      }
      setVisibleFeedback(false);
      setIsAnswerCorrect(false); // Reset the correct answer state
    }
  };

  return (
    <>
      {/* Display Note */}
      <View className="bg-transparent w-[80%] h-[35%] items-center justify-center relative rounded-xl">
        {randomNote && (
          <>
            <Image
              source={noteImages[randomNote]}
              className="w-[90%] h-[50%] z-0"
              resizeMode="contain"
            />
            <TouchableOpacity
              className="flex items-center justify-center mt-10 w-[20%] h-[22%] bg-accent border border-primary rounded-full shadow-lg"
              onPress={() => playSound(randomNote)}
            >
              <Text className="text-white font-bold text-center text-3xl">🔊</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Buttons */}
      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleNotes
          notes={buttonNotes}
          selectedNote={selectedNote}
          onNotePress={handleNotePress}
          disabled={!isChecking}
        />

        {/* Feedback */}
        <Feedback
          isCorrect={selectedNote === randomNote} // Determine if the answer is correct
          visible={visibleFeedback} // Control visibility of feedback
        />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <TouchableOpacity
            className="w-[80%] h-[50%] bg-accent rounded-xl justify-center shadow-md border border-accent"
            onPress={handleMainButton}
          >
            <Text className="text-white font-bold text-center">
              {isChecking ? 'Check Answer' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default NoteReadingGame;
