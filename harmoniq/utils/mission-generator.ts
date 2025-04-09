import { Mission } from '@/constants/types';
import pool from '@/data/mission-pool.json';

export function generateMissions(): Mission[] {
  const dailyPool = [...pool.daily];
  const weeklyPool = [...pool.weekly];

  const getRandom = (arr: any[], count: number) => {
    return arr
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  };

  const staticDaily: Mission = {
    id: 'login',
    title: 'Log in today',
    type: 'daily',
    completed: false,
    xpReward: 25,
    progress: { current: 0, goal: 1 }
  };

  const selectedDailies = getRandom(dailyPool, 2).map(item => ({
    ...item,
    type: 'daily',
    completed: false,
    progress: { current: 0, goal: item.goal }
  }));

  const selectedWeekly = getRandom(weeklyPool, 1).map(item => ({
    ...item,
    type: 'weekly',
    completed: false,
    progress: { current: 0, goal: item.goal }
  }));

  return [staticDaily, ...selectedDailies, ...selectedWeekly];
}
