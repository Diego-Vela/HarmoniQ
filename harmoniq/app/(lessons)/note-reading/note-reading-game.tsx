import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNoteReading } from '@/hooks/useNoteReading';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import Feedback from '@/components/activities/common/feedback';
import { NoteReadingGameProps } from '@/constants/types';
import AnimatedCheckButton from '@/components/activities/buttons/check-answer-button';

const NoteReadingGame: React.FC<NoteReadingGameProps> = ({
  notes,
  noteImages,
  onSuccess,
}) => {
  const {
    selectedNote,
    setSelectedNote,
    isChecking,
    regenerateNote,
    handleCheckAnswer,
    playSound,
  } = useNoteReading(notes);

  const [visibleFeedback, setVisibleFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [buttonKey, setButtonKey] = useState(0); // Key for remounting the button
  const [currentChallenge, setCurrentChallenge] = useState<{
    correctAnswer: string;
    options: string[];
  } | null>(null);

  useEffect(() => {
    regenerateNote(setCurrentChallenge); // Pass the state updater for currentChallenge
  }, []);

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note.toLowerCase());
      await playSound(note.toLowerCase());
    }
  };

  const handleMainButton = () => {
    if (isChecking) {
      const userMadeChoice = selectedNote !== null;
      const isCorrect = userMadeChoice && selectedNote === currentChallenge?.correctAnswer;

      handleCheckAnswer();
      setVisibleFeedback(true);
      setIsAnswerCorrect(isCorrect);
    } else {
      if (isAnswerCorrect) {
        onSuccess();
      } else {
        regenerateNote();
      }

      setVisibleFeedback(false);
      setIsAnswerCorrect(null);
      setButtonKey((prev) => prev + 1); // Force remount to reset animation
    }
  };

  return (
    <>
      <View className="bg-transparent w-[80%] h-[35%] items-center justify-center relative rounded-xl">
        {currentChallenge?.correctAnswer && (
          <>
            <Image
              source={noteImages[currentChallenge.correctAnswer]}
              className="w-[90%] h-[50%] z-0"
              resizeMode="contain"
            />
            <TouchableOpacity
              className="flex items-center justify-center mt-10 w-[20%] h-[22%] bg-accent border border-primary rounded-full shadow-lg"
              onPress={() => playSound(currentChallenge.correctAnswer)}
            >
              <Text className="text-white font-bold text-center text-3xl">🔊</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleNotes
          notes={currentChallenge?.options || []}
          selectedNote={selectedNote}
          correctNote={currentChallenge?.correctAnswer || ''}
          onNotePress={handleNotePress}
          disabled={!isChecking}
          showFeedback={visibleFeedback}
          isAnswerCorrect={isAnswerCorrect}
        />

        <Feedback
          isCorrect={selectedNote === currentChallenge?.correctAnswer}
          visible={visibleFeedback}
        />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <AnimatedCheckButton
            key={buttonKey} // Remount button to reset animation
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
