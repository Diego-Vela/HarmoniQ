import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import ActivityBase from '@/components/activity-base';
import Feedback from '@/components/feedback';
import SimpleNotes from '@/components/buttons/simple-notes';
import { keySignatureImages } from '@/constants/keys';

const KeySignatureGame = () => {
  const [currentKey, setCurrentKey] = useState(generateKey());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  const handlePress = (key: string) => {
    if (isChecking) {
      setSelectedKey(key);
    }
  };

  const handleMainButton = () => {
    if (isChecking) {
      setIsChecking(false);
      setShowFeedback(true);
    } else {
      setCurrentKey(generateKey());
      setSelectedKey(null);
      setIsChecking(true);
      setShowFeedback(false);
    }
  };

  return (
    <ActivityBase description="Select the correct key signature">
      {/* Signature Image */}
      <View className="bg-transparent w-[80%] h-[35%] items-center justify-center relative rounded-xl">
        <Image
          source={currentKey.image}
          className="w-[90%] h-[50%]"
          resizeMode="contain"
        />
      </View>

      {/* Buttons and Feedback */}
      <View className="flex-col bg-primary rounded-xl border border-primary w-[80%] h-[50%] items-center justify-evenly shadow-lg">
        <SimpleNotes
          notes={currentKey.options}
          selectedNote={selectedKey}
          onNotePress={handlePress}
          disabled={!isChecking}
        />

        <Feedback
          isCorrect={selectedKey === currentKey.correctAnswer}
          visible={showFeedback}
        />

        <TouchableOpacity
          className="w-[80%] h-[15%] bg-accent rounded-xl justify-center shadow-md border border-accent mt-3"
          onPress={handleMainButton}
        >
          <Text className="text-white font-bold text-center text-lg">
            {isChecking ? 'Check Answer' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </ActivityBase>
  );
};

function generateKey() {
  const allKeys = Object.keys(keySignatureImages); // Get all key names
  const correct = allKeys[Math.floor(Math.random() * allKeys.length)] as keyof typeof keySignatureImages; // Pick a random key
  const options = shuffle(allKeys.filter((k) => k !== correct)).slice(0, 3); // Pick 3 random incorrect options
  options.push(correct); // Add the correct answer to the options
  return {
    image: keySignatureImages[correct], // Get the image for the correct key
    correctAnswer: correct, // The correct key name
    options: shuffle(options), // Shuffle the options
  };
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default KeySignatureGame;
