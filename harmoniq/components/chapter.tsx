import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';

interface ChapterStatus {
  chapterKey: string;
  topic: string;
  isUnlocked: boolean;
  unlockRequirement: string;
}

interface ChapterProps {
  currentChapter: string;
  chapterStatus: ChapterStatus[];
  onSelectChapter: (chapterKey: string) => void;
}

const shadowClass = Platform.OS === 'ios' ? 'shadow-sm' : 'shadow-md';
const { width, height } = Dimensions.get('window');

const Chapter: React.FC<ChapterProps> = ({ currentChapter, chapterStatus, onSelectChapter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandAnim] = useState(new Animated.Value(0));
  const [selectedChapter, setSelectedChapter] = useState({
    chapterKey: currentChapter,
    topic: chapterStatus.find((c) => c.chapterKey === currentChapter)?.topic || '',
  });

  // Update selectedChapter when currentChapter prop changes
  useEffect(() => {
    const newChapter = chapterStatus.find((c) => c.chapterKey === currentChapter);
    if (newChapter) {
      setSelectedChapter({
        chapterKey: newChapter.chapterKey,
        topic: newChapter.topic,
      });
    }
  }, [currentChapter, chapterStatus]);

  const handleChapterClick = (chapterKey: string, topic: string) => {
    setSelectedChapter({ chapterKey, topic }); // Update the selected chapter and topic
    onSelectChapter(chapterKey); // Call the parent function to handle chapter selection
    toggleExpansion(true); // Collapse the dropdown
  };

  const toggleExpansion = (forceCollapse = false) => {
    const toValue = forceCollapse ? 0 : isExpanded ? 0 : 1;

    Animated.timing(expandAnim, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!forceCollapse && !isExpanded);
  };

  const dropdownHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, chapterStatus.length * 80], // estimate 80px per item
  });

  return (
    <TouchableOpacity
      onPress={() => toggleExpansion()}
      activeOpacity={0.9}
      style={{
        width: width * 0.9,
        alignSelf: 'center',
        zIndex: 10,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderColor: '#f97316', // your orange color
        backgroundColor: '#0a2342', // adjust if needed
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 24,
      }}
      className={`${shadowClass} shadow-gray-600`}
    >
      {/* Header content */}
      <View className="flex-row items-center justify-between p-4">
        {/* Chapter text */}
        <View className="w-[40%] items-center justify-center">
          <Text
            className="text-white text-2xl font-bold text-center"
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {selectedChapter.chapterKey}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-[65%] w-[1px] bg-gray-600 rounded-sm" />

        {/* Topic */}
        <View className="w-[50%] items-center justify-center pl-2 flex-row">
          <Text
            className="text-white text-lg text-center"
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {selectedChapter.topic}
          </Text>
        </View>
      </View>

      {/* Expanded content (inside same box) */}
      <Animated.View
        style={{
          height: dropdownHeight,
          overflow: 'hidden',
        }}
      >
        <View className="mt-4">
          {chapterStatus.map((chapter) => (
            <TouchableOpacity
              key={chapter.chapterKey}
              onPress={() => handleChapterClick(chapter.chapterKey, chapter.topic)}
              className={`w-full mb-2 px-4 py-3 rounded-lg ${
                chapter.chapterKey === selectedChapter.chapterKey
                  ? 'bg-amber-700'
                  : 'bg-gray-700'
              }`}
            >
              <View className="flex-row justify-between items-center">
                {/* Chapter Key */}
                <Text
                  className={`font-semibold text-xl text-white`}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {chapter.chapterKey}
                </Text>

                {/* Unlock Requirement Text */}
                {!chapter.isUnlocked && chapter.unlockRequirement && (
                  <Text
                    className={`text-sm font-bold ml-2 italic ${
                      chapter.chapterKey === selectedChapter.chapterKey
                        ? 'text-gray-600'
                        : 'text-red-300'
                    }`}
                  >
                    Clear {chapter.unlockRequirement}
                  </Text>
                )}
              </View>

              {/* Chapter Topic */}
              <Text
                className="text-gray-300 text-md"
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {chapter.topic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Chapter;
