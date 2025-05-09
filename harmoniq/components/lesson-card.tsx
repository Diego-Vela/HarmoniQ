import React, { useState, useRef } from 'react';
import { Text, TouchableOpacity, Image, View, Dimensions, Animated, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { icons } from '@/constants/icons';
import { useStatsStore } from '@/stores/useStatsStore';
import { getLessonXP, getIncreaseLevelCap } from '@/utils/xp-utils';

interface LessonCardProps {
  chapter: string;
  level: number | string;
}

const { width, height } = Dimensions.get('window');

const LessonCard: React.FC<LessonCardProps> = ({ chapter, level }) => {
  const [flipped, setFlipped] = useState(false);

  const lessonKey = `${chapter}-${level}`;
  const lastCompletedLesson = useStatsStore((s) => s.lastCompletedLesson);
  const isNext = useStatsStore((s) => s.nextLesson) === lessonKey;
  const hasCompletedBefore = lastCompletedLesson && lessonKey <= lastCompletedLesson;
  const isLocked = !isNext && !hasCompletedBefore;

  const xpReward = hasCompletedBefore ? 0 : getLessonXP(Number(chapter.split(" ")[1]), `${lessonKey}`);
  const increaseLevelCap = hasCompletedBefore ? false : getIncreaseLevelCap(`${lessonKey}`);

  const shadowClass = isNext ? 'shadow-lg' : 'shadow-sm';

  const shadowColor = hasCompletedBefore
    ? 'shadow-amber-400'
    : isNext
    ? 'shadow-blue-400'
    : 'shadow-white';

  const border = hasCompletedBefore
    ? 'border border-amber-400'
    : isNext
    ? Platform.OS === 'ios' ? 'border border-blue-600' : 'border border-white'
    : '';

  const completedColor = hasCompletedBefore
    ? 'text-amber-400'
    : isNext
    ? 'text-blue-400'
    : 'text-gray-400';

  const imageTintColor = hasCompletedBefore
    ? '#fbbf24'
    : isNext
    ? '#2563eb'
    : '#4B5563';

  const cardSize = {
    width: width * 0.5,
    height: height * 0.25,
    marginTop: height * 0.04,
  };

  // Animation Start
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 0 : 180, // toggle between 0 and 180
      duration: 400,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
  };

  const backStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
  };

  const styles = StyleSheet.create({
    cardFace: {
      position: 'absolute',
      backfaceVisibility: 'hidden',
      width: width * 0.5,
      height: height * 0.25,
    },
  });

  const FrontContent = (
    <TouchableOpacity
      className={`self-center py-6 mb-10 rounded-2xl justify-center bg-primary w-full h-full ${border} ${shadowClass} ${shadowColor} items-center`}
      activeOpacity={0.7}
      onPress={flipCard}
    >
      <Image
        source={hasCompletedBefore ? icons.completedLesson : icons.lesson}
        tintColor={imageTintColor}
        style={{ width: '50%', height: '50%', marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text className="text-white font-bold text-xl mb-1" adjustsFontSizeToFit numberOfLines={1}>
        Lesson {level}
      </Text>
      <Text className={`${completedColor} italic text-lg`} adjustsFontSizeToFit numberOfLines={1}>
        {hasCompletedBefore ? 'Completed' : isNext ? 'Next Lesson' : 'Not Unlocked'}
      </Text>
    </TouchableOpacity>
  );

  const BackContent = (
    <TouchableOpacity
      onPress={flipCard}
      className={`self-center rounded-2xl bg-primary w-full h-full ${border} ${shadowClass} ${shadowColor}`}
      activeOpacity={0.8}
    >
      {/* Back Content Section */}
      <View className="flex w-full h-full justify-evenly items-center">
        <View className="flex justify-evenly align-center w-full h-[60%]">
          <Text
            className={`${
              hasCompletedBefore ? 'text-amber-400' : 'text-amber-400'
            } font-bold text-2xl mb-2 text-center`}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {hasCompletedBefore ? 'Complete' : 'Rewards'}
          </Text>
          <View className="w-full h-[60%]">
            {!hasCompletedBefore && (
              <Text
                className="text-white text-lg text-center"
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                Exp: {xpReward}
              </Text>
            )}
            {increaseLevelCap && !hasCompletedBefore && (
              <Text
                className="text-white text-lg text-center"
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                Level Cap Up
              </Text>
            )}
          </View>
        </View>

        <View className="flex-col w-full h-[30%] justify-center items-center">
          {isLocked ? (
            <Text className="text-gray-400 font-bold text-lg italic">Locked</Text>
          ) : (
            <Link
              href={{
                pathname: '/screens/entry-point',
                params: {
                  category: 'lesson',
                  subcategory: chapter,
                  level: String(level),
                },
              }}
              asChild
            >
              <TouchableOpacity className="bg-green-600 px-4 py-2 rounded-lg">
                <Text className="text-white font-bold text-lg">
                  {hasCompletedBefore ? 'Replay' : 'Begin Lesson'}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={cardSize}>
      <Animated.View
        style={[styles.cardFace, frontStyle]}
        pointerEvents={!flipped ? 'auto' : 'none'}
      >
        {FrontContent}
      </Animated.View>
      <Animated.View
        style={[styles.cardFace, backStyle]}
        pointerEvents={flipped ? 'auto' : 'none'}
      >
        {BackContent}
      </Animated.View>
    </View>
  );
};

export default LessonCard;