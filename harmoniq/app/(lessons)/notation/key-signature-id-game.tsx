import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import ActivityBase from '@/components/activities/activity-base';
import Feedback from '@/components/activities/feedback';
import SimpleNotes from '@/components/activities/buttons/simple-notes';
import { ActivityComponentProps } from '@/constants/types';

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

const KeySignatureGame: React.FC<ActivityComponentProps> = ({ level, onSuccess }) => {
  const [currentKey, setCurrentKey] = useState(() => generateKey(level.toString()));
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const targetCorrect = 10;

  useEffect(() => {
    setCurrentKey(generateKey(level.toString()));
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

      if (selectedKey === currentKey.correctAnswer) {
        onSuccess();
      }
    } else {
      setCurrentKey(generateKey(level.toString()));
      setSelectedKey(null);
      setIsChecking(true);
      setShowFeedback(false);
    }
  };

  return (
    <>

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
    </>
  );
};

function generateKey(level: string) {
  const levelConfig = keyIdLevels.levels.find((lvl) => lvl.level === level);

  if (!levelConfig) {
    throw new Error(`Level ${level} not found in key-id-levels.json`);
  }

  const { quality, staff, keys } = levelConfig;
  let availableKeys: Record<string, any> = {};

  if (staff === 'treble' || staff === 'both') {
    availableKeys = quality === 'major'
      ? { ...TrebleSharpMajors, ...TrebleFlatMajors }
      : { ...TrebleSharpMinors, ...TrebleFlatMinors };
  }

  if (staff === 'bass' || staff === 'both') {
    availableKeys = quality === 'major'
      ? { ...availableKeys, ...BassSharpMajors, ...BassFlatMajors }
      : { ...availableKeys, ...BassSharpMinors, ...BassFlatMinors };
  }

  const filteredKeys = Object.keys(availableKeys).filter((key) =>
    keys.includes(key.split(' ')[0])
  );

  const correctKey = filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
  const incorrectKeys = filteredKeys.filter((key) => key !== correctKey);
  const randomIncorrectKeys = shuffle(incorrectKeys).slice(0, 3);
  const options = shuffle([...randomIncorrectKeys, correctKey]);

  return {
    image: availableKeys[correctKey],
    correctAnswer: correctKey,
    options,
  };
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default KeySignatureGame;
