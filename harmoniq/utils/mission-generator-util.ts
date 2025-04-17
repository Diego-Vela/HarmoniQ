import { Mission, MissionWithProgress } from '@/constants/types';
import missionsRaw from '@/data/mission-pool.json';

const missions = missionsRaw as {
  daily: Mission[];
  weekly: Mission[];
};

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function generateMissions(
  pool: Mission[],
  count: number
): MissionWithProgress[] {
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count).map((mission) => ({
    ...mission,
    progress: 0,
  }));
}

export function generateDailyMissions(count: number): MissionWithProgress[] {
  return generateMissions(missions.daily, count);
}

export function generateWeeklyMissions(count: number): MissionWithProgress[] {
  return generateMissions(missions.weekly, count);
}
