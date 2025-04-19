import lessonData from '@/data/unlock-data.json';
import { useStatsStore } from '@/stores/useStatsStore';


//Unused Utility function to get the current chapter and lessons
export const getCurrentChapterData = () => {
  const nextLesson = useStatsStore((s) => s.nextLesson);

  // Find the current chapter based on the nextLesson
  const chapterData = lessonData.chapter.find((chapter) =>
    nextLesson?.startsWith(chapter.chapterKey)
  );
  
  return { 
    currentChapter: chapterData?.chapterKey || "Chapter 1", 
    currentLessons: chapterData?.lessons || [] 
  };
}

export const getLessonsForChapter = (chapterKey: string) => {
  return lessonData.chapter.find((c) => c.chapterKey === chapterKey)?.lessons || [];
};

export const getChapterStatus = () => {
  const lastCompletedLesson = useStatsStore.getState().lastCompletedLesson;

  return lessonData.chapter.map((chapter) => {
    const isUnlocked = !chapter.unlockRequirement
      ? true
      : lastCompletedLesson && lastCompletedLesson >= chapter.unlockRequirement;

    return {
      chapterKey: chapter.chapterKey,
      topic: chapter.topicName,
      unlockRequirement: chapter.unlockRequirement,
      isUnlocked,
    };
  });
};

