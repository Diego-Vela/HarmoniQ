import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import ActivityBase from '@/components/activities/common/activity-base';
import Timer from '@/components/activities/common/timer';
import { useNoteReading } from '@/hooks/useNoteReading';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import AnimatedNextButton from '@/components/activities/buttons/animated-next-button';
import { NoteReadingTimedProps } from '@/constants/types';

const MAX_TIME = 60;
const REQUIRED_CORRECT = 15;
const REQUIRED_ACCURACY = 80;

const NoteReadingTimed: React.FC<NoteReadingTimedProps> = ({
  clef,
  notes,
  noteImages,
  level = 1,
  onComplete,
}) => {
  const [results, setResults] = useState<boolean[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const {
    randomNote,
    isChecking,
    regenerateNote,
    handleCheckAnswer,
    buttonNotes,
    playSound,
  } = useNoteReading(notes);

  if (!notes || notes.length === 0) {
    return (
      <ActivityBase>
        <Text className="text-white text-xl">No notes available for this level.</Text>
      </ActivityBase>
    );
  }

  const handleAnswer = async (note: string) => {
    if (!isChecking) return;

    setSelectedNote(note);
    await playSound(note);
  };

  const handleNext = () => {
    if (selectedNote !== null) {
      const correct = selectedNote === randomNote;
      setIsAnswerCorrect(correct);
      setResults((prev) => [...prev, correct]);

      // Flash green/red briefly, then move to next
      setTimeout(() => {
        setSelectedNote(null);
        setIsAnswerCorrect(null);
        regenerateNote();
      }, 100); // delay for visual feedback
    }
  };

  const getCorrectCount = () => results.filter(Boolean).length;
  const getAccuracy = () =>
    results.length > 0 ? ((getCorrectCount() / results.length) * 100).toFixed(0) : '0';

  const didPassTrial = () => {
    return (
      getCorrectCount() >= REQUIRED_CORRECT &&
      parseFloat(getAccuracy()) >= REQUIRED_ACCURACY
    );
  };

  const handleComplete = () => {
    onComplete([
      `${getCorrectCount()} / ${results.length}`, // Number correct / total answered
      `${getAccuracy()}%`, // Accuracy percentage
    ]);
  };

  return (
    <View className="flex-1 h-full w-full justify-evenly items-center pt-6 space-y-4">
      {/* Timer */}
      <Timer
        duration={MAX_TIME}
        onComplete={handleComplete} // Call onComplete directly when the timer ends
      />

      {/* Note Display */}
      <View className="bg-transparent w-[80%] h-[35%] items-center justify-center relative rounded-xl">
        {randomNote && (
          <>
            <Image
              source={noteImages[randomNote]}
              className="w-[90%] h-[60%] z-0"
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

      {/* Answer Buttons */}
      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleNotes
          notes={buttonNotes}
          selectedNote={selectedNote}
          correctNote={randomNote}
          onNotePress={handleAnswer}
          disabled={!isChecking}
          showFeedback={false} // Feedback is excluded
          isAnswerCorrect={selectedNote === randomNote}
        />

        <View className="flex w-[90%] h-[20%] bg-transparent rounded-xl items-center justify-evenly z-1">
          <AnimatedNextButton
            isCorrect={isAnswerCorrect}
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
};

export default NoteReadingTimed;
