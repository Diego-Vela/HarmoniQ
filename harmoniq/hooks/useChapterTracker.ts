import { useState, useEffect } from 'react';
import { useStatsStore } from '@/stores/useStatsStore';
import lessonData from '@/data/unlock-data.json';

export const useChapterTracker = () => {
  const nextLesson = useStatsStore((s) => s.nextLesson);

  // Derive initial chapter from nextLesson
  const deriveChapterKey = (lessonKey: string | null | undefined) => {
    if (!lessonKey) return null;
    const chapter = lessonData.chapter.find((c) =>
      lessonKey.startsWith(c.chapterKey)
    );
    return chapter?.chapterKey ?? null;
  };

  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // On first load, if not already selected, derive from nextLesson
  useEffect(() => {
    if (!selectedChapter && nextLesson) {
      const derived = deriveChapterKey(nextLesson);
      if (derived) setSelectedChapter(derived);
    }
  }, [nextLesson]);

  return {
    currentChapterKey: selectedChapter,
    setCurrentChapterKey: setSelectedChapter,
  };
};
