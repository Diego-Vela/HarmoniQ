import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNoteReading } from '@/hooks/useNoteReading';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import Feedback from '@/components/activities/feedback';
import { NoteReadingGameProps } from '@/constants/types';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-button';

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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note);
      await playSound(note);
    }
  };

  const handleMainButton = () => {
    if (isChecking) {
      const userMadeChoice = selectedNote !== null;
      const isCorrect = userMadeChoice && selectedNote === randomNote;

      if (!userMadeChoice) {
        console.log('No selection made. Treating as incorrect.');
      }

      handleCheckAnswer();
      setVisibleFeedback(true);
      setIsAnswerCorrect(isCorrect); // Treat null submissions as incorrect
    } else {
      if (isAnswerCorrect) {
        onSuccess();
      } else {
        regenerateNote();
      }

      setVisibleFeedback(false);
      setIsAnswerCorrect(null);
    }
  };

  return (
    <>
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

      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleNotes
          notes={buttonNotes}
          selectedNote={selectedNote}
          onNotePress={handleNotePress}
          disabled={!isChecking}
        />

        <Feedback
          isCorrect={selectedNote === randomNote}
          visible={visibleFeedback}
        />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <AnimatedCheckButton
            isChecking={isChecking}
            isCorrect={visibleFeedback ? isAnswerCorrect : null}
            onPress={handleMainButton}
            label={
              isChecking
                ? 'Check Answer'
                : visibleFeedback
                ? 'Continue'
                : 'Start'
            }
          />
        </View>
      </View>
    </>
  );
};

export default NoteReadingGame;
