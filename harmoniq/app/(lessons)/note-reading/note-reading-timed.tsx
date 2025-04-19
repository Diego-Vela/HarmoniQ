import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import ActivityBase from '@/components/activities/common/activity-base';
import Timer from '@/components/activities/common/timer';
import { useNoteReading } from '@/hooks/useNoteReading';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import AnimatedNextButton from '@/components/activities/buttons/animated-next-button';
import { NoteReadingTimedProps } from '@/constants/types';

const MAX_TIME = 60;

const NoteReadingTimed: React.FC<NoteReadingTimedProps> = ({
  clef,
  notes,
  noteImages,
  level = 1,
  onComplete,
  onSuccess
}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

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
      setIsAnswerCorrect(correct); // ✅ Update isCorrect
      setResults((prev) => [...prev, correct]);
  
      // Flash green/red briefly, then move to next
      setTimeout(() => {
        setSelectedNote(null);
        setIsAnswerCorrect(null); // Reset isCorrect to null
        regenerateNote();
      }, 100); // delay for visual feedback
    }
  };

  const getCorrectCount = () => results.filter(Boolean).length;
  const getAccuracy = () =>
    results.length > 0 ? ((getCorrectCount() / results.length) * 100).toFixed(0) : '0';

  return (
    <>
      <View className="flex-1 h-full w-full  justify-evenly items-center pt-6 space-y-4">
        {/* Timer */}
        {!isComplete && (
          <Timer
            duration={MAX_TIME}
            onComplete={() => {
              console.log('Correct Count:', getCorrectCount()); // Log the correct count
              console.log('Accuracy:', getAccuracy() + '%'); // Log the accuracy percentage
              setIsComplete(true);
              onComplete?.();
            }}
          />
        )}

        {/* Note Display */}
        {!isComplete && (
          <>
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
                  onPress={() => {handleNext()}}
                />
              </View>
            </View>
          </>
        )}

        {/* Results */}
        {isComplete && (
          <View className="items-center space-y-2">
            <Text className="text-white text-2xl font-bold">Time's Up!</Text>
            {results.length > 0 ? (
              <>
                <Text className="text-white text-lg">
                  Correct: {getCorrectCount()} / {results.length}
                </Text>
                <Text className="text-white text-lg">Accuracy: {getAccuracy()}%</Text>
              </>
            ) : (
              <Text className="text-white text-lg">No answers recorded.</Text>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default NoteReadingTimed;
