import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import ActivityBase from '@/components/activities/activity-base';
import Feedback from '@/components/activities/feedback';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import {
  TrebleSharpMajors,
  TrebleFlatMajors,
  TrebleSharpMinors,
  TrebleFlatMinors,
  BassSharpMajors,
  BassFlatMajors,
  BassSharpMinors,
  BassFlatMinors,
} from '@/constants/keys';
import keyIdLevels from '@/data/key-id-levels.json';

const KeySignatureGame = () => {
  const { level } = useLocalSearchParams(); // Grab the level from the URL or navigation params
  const [currentKey, setCurrentKey] = useState(() => generateKey(level as string));
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    // Regenerate the key when the level changes
    setCurrentKey(generateKey(level as string));
    setSelectedKey(null);
    setIsChecking(true);
    setShowFeedback(false);
  }, [level]);

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
      setCurrentKey(generateKey(level as string));
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

function generateKey(level: string) {
  // Find the level configuration from the JSON file
  const levelConfig = keyIdLevels.levels.find((lvl) => lvl.level === level);

  if (!levelConfig) {
    throw new Error(`Level ${level} not found in key-id-levels.json`);
  }

  const { quality, staff, keys } = levelConfig;

  // Combine the relevant constants based on quality and staff
  let availableKeys: Record<string, any> = {};

  if (staff === 'treble' || staff === 'both') {
    if (quality === 'major') {
      availableKeys = { ...TrebleSharpMajors, ...TrebleFlatMajors };
    } else if (quality === 'minor') {
      availableKeys = { ...TrebleSharpMinors, ...TrebleFlatMinors };
    }
  }

  if (staff === 'bass' || staff === 'both') {
    if (quality === 'major') {
      availableKeys = { ...availableKeys, ...BassSharpMajors, ...BassFlatMajors };
    } else if (quality === 'minor') {
      availableKeys = { ...availableKeys, ...BassSharpMinors, ...BassFlatMinors };
    }
  }

  // Filter available keys based on the `keys` array from the JSON file
  const filteredKeys = Object.keys(availableKeys).filter((key) => keys.includes(key.split(' ')[0]));

  // Pick a random correct key
  const correctKey = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];

  // Generate 3 random incorrect options
  const incorrectKeys = filteredKeys.filter((key) => key !== correctKey);
  const randomIncorrectKeys = shuffle(incorrectKeys).slice(0, 3);

  // Combine and shuffle options
  const options = shuffle([...randomIncorrectKeys, correctKey]);

  return {
    image: availableKeys[correctKey], // Get the image for the correct key
    correctAnswer: correctKey, // The correct key name
    options, // The shuffled options
  };
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default KeySignatureGame;
