import lessonData from '@/data/unlock-data.json'; // Make sure this points to your actual file
import { useStatsStore } from '@/stores/useStatsStore';
import { useXpStore } from '@/stores/useXpStore';

export const completeLesson = () => {
  const lastLesson = useStatsStore.getState().lastCompletedLesson;
  const xpStore = useXpStore.getState();

  const lessons = lessonData.lessons;
  const chapter = 'Chapter 1';

  // Find the current lesson in the JSON
  const current = lessons.find((entry) => entry.lesson === lastLesson);

  const nextLesson = current?.next ? `Chapter ${current.next}` : 'Chapter 1-1';
  const newCap = current?.['level-cap'] ?? 5;

  // Update level cap if needed
  if (newCap > xpStore.levelCap) {
    useXpStore.getState().increaseLevelCap(newCap);
  }

  return nextLesson;
};
