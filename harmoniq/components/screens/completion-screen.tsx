import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { CompletionScreenProps } from '@/constants/types';
import React, { useEffect, useRef } from 'react';
import Background from '@/components/common/background';
import { medals } from '@/constants/animations';

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  mode,
  xpAwarded,
  onNext,
  onReplay,
  hasClaimed,
  onClaim,
  results,
}) => {
  const title = mode === 'training' ? '🎯 Training Complete!' : '📘 Lesson Complete!';
  const subtitle = xpAwarded > 0 ? `You earned ${xpAwarded} XP!` : null;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (hasClaimed && xpAwarded > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 1500);
      });
    }
  }, [hasClaimed]);

  const heightClass = results && results.length > 0 ? 'h-[40%]' : 'h-[35%]';
  //console.log('results:', results);

  return (
    <Background>
      {/* Top Center Results Section */}
      <View className={`flex justify-center w-full items-center ${heightClass}`}>
        {results && (
          <View>
            <Text className="text-green-400 text-3xl font-bold text-center mb-[2%]">
              {results[0]} Correct
            </Text>
            <Text className="text-cyan-400 text-xl font-semibold text-center">
              {results[1]} Accuracy!
            </Text>
            {results[2] && (
              <View className="flex flex-row justify-center items-center mt-2">
                <Text className="text-yellow-400 text-xl font-bold text-center">
                  You've earned a{' '}
                </Text>
                <Image
                  source={medals[results[2].toLowerCase() as keyof typeof medals]}
                  style={{ width: 24, height: 24, marginHorizontal: 4 }}
                  resizeMode="contain"
                />
                <Text className="text-yellow-400 text-xl font-bold text-center">
                  medal!
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-start items-center px-6 ">
        <Text className="text-yellow-400 text-4xl font-extrabold animate-pulse mb-4 text-center">
          {title}
        </Text>
        {subtitle && <Text className="text-white text-xl mb-10 text-center">{subtitle}</Text>}

        {hasClaimed && xpAwarded > 0 && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="mb-6"
          >
            <Text className="text-yellow-400 text-3xl font-bold animate-pulse text-center">
              +{xpAwarded} XP!
            </Text>
          </Animated.View>
        )}

        {xpAwarded > 0 && !hasClaimed ? (
          <TouchableOpacity
            onPress={onClaim}
            className="bg-green-600 w-[80%] py-4 rounded-xl mt-4"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Claim XP
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {mode === 'training' && onReplay && (
              <TouchableOpacity
                className="bg-primary w-[90%] py-5 rounded-2xl mb-5 mt-4"
                onPress={onReplay}
              >
                <Text className="text-white text-center font-semibold text-lg text-center">
                  Replay Training
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-accent w-[90%] py-5 rounded-2xl mt-5"
              onPress={onNext}
            >
              <Text className="text-white text-center font-semibold text-lg text-center">
                {mode === 'training' ? 'Back to Training Select' : 'Back to Home'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Background>
  );
};

export default CompletionScreen;
