import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNoteReading } from '@/hooks/useNoteReading';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import Feedback from '@/components/activities/feedback';
import { NoteReadingGameProps } from '@/constants/types';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Animated values
  const bgColorValue = useSharedValue('rgb(255, 121, 0)'); // orange (#FF7900)
  const scaleValue = useSharedValue(1);
  const shakeX = useSharedValue(0);

  // Update background color based on correctness
  useEffect(() => {
    if (!isChecking && isAnswerCorrect) {
      bgColorValue.value = withTiming('rgb(22, 163, 74)', { duration: 300 }); // green
    } else {
      bgColorValue.value = withTiming('rgb(255, 121, 0)', { duration: 300 }); // reset to orange
    }
  }, [isChecking, isAnswerCorrect]);

  // Combine all animations into a style
  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColorValue.value,
    transform: [
      { scale: scaleValue.value },
      { translateX: shakeX.value },
    ],
  }));

  const handleNotePress = async (note: string) => {
    if (isChecking) {
      setSelectedNote(note);
      await playSound(note);
    }
  };

  const handleMainButton = () => {
    if (isChecking) {
      const isCorrect = selectedNote === randomNote;
      handleCheckAnswer();
      setVisibleFeedback(true);
      setIsAnswerCorrect(isCorrect);

      if (isCorrect) {
        scaleValue.value = withSequence(
          withSpring(1.3),
          withSpring(1)
        );
      } else {
        shakeX.value = withSequence(
          withTiming(-15, { duration: 50 }),
          withTiming(15, { duration: 50 }),
          withTiming(-6, { duration: 50 }),
          withTiming(6, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      }
    } else {
      if (isAnswerCorrect) {
        onSuccess();
      } else {
        regenerateNote();
      }

      setVisibleFeedback(false);
      setIsAnswerCorrect(false);
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

        <Feedback
          isCorrect={selectedNote === randomNote}
          visible={visibleFeedback}
        />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly">
          <Animated.View
            style={[{ width: '80%', height: '50%', borderRadius: 16 }, animatedButtonStyle]}
            className="justify-center shadow-md border border-accent"
          >
            <TouchableOpacity onPress={handleMainButton}>
              <Text className="text-white font-bold text-center">
                {isChecking ? 'Check Answer' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

export default NoteReadingGame;
