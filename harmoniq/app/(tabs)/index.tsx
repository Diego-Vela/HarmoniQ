import React, { useEffect } from "react";
import { View, ScrollView, Dimensions, Image } from "react-native";

import { useChapterTracker } from '@/hooks/useChapterTracker';
import { getLessonsForChapter, getChapterStatus } from "@/utils/chapter-utils";
import { specialLessonKeys } from '@/constants/lesson-keys';

import Chapter from "@/components/chapter";
import LessonCard from "@/components/lesson-card";
import Background from "@/components/common/background";
import TrialCard from "@/components/trial-card";

import { useMedalStore } from "@/stores/useMedalStore";

export default function Index() {
  const chapterStatus = getChapterStatus().map(status => ({
    ...status,
    isUnlocked: !!status.isUnlocked, // Has to be boolean for some reason
  }));
  const { currentChapterKey, setCurrentChapterKey } = useChapterTracker();
  const currentLessons = getLessonsForChapter(currentChapterKey || "Chapter 1");

  return (
    <Background>
      {/* Chapter Component */}
      <View style={{ position: 'relative', zIndex: 10 }}>
        <Chapter
          currentChapter={currentChapterKey || "Chapter 1"}
          chapterStatus={chapterStatus}
          onSelectChapter={(key) => setCurrentChapterKey(key)}
        />
      </View>

      {/* ScrollView */}
      <ScrollView
        className="flex-1"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 120 }}
        style={{ zIndex: 1 }} // Ensure ScrollView is behind Chapter
      >
        <View
          className="flex flex-col justify-between items-center bg-transparent rounded-lg"
          style={{}} // Set marginTop to 15% of screen height
        >
          {/* Iterate through currentLessons */}
          {currentLessons.map((lesson, index) => {
            const lessonKey = `${lesson.chapter}-${lesson.section}`;
            if (specialLessonKeys.has(lessonKey)) {
              // Render TrialCard if the lesson key is in specialLessonKeys
              return (
                <TrialCard
                  key={lessonKey}
                  chapter={lesson.chapter}
                  level={lesson.section}
                />
              );
            }

            // Render LessonCard otherwise
            return (
              <LessonCard
                key={lessonKey}
                chapter={lesson.chapter} // Pass chapter
                level={lesson.section} // Pass section as level
              />
            );
          })}
        </View>
      </ScrollView>
    </Background>
  );
}
