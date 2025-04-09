import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mission } from '@/constants/types';
import { generateMissions } from '@/utils/mission-generator';

const DAILY_KEY = 'lastDailyReset';
const WEEKLY_KEY = 'lastWeeklyReset';
const MISSIONS_KEY = 'missions';

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  const isNewDay = (stored: string | null) => {
    if (!stored) return true;
    const last = new Date(stored);
    const now = new Date();
    return last.toDateString() !== now.toDateString();
  };

  const isNewWeek = (stored: string | null) => {
    if (!stored) return true;
    const now = new Date();
    const last = new Date(stored);
    const getWeek = (d: Date) => {
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
    return now.getFullYear() !== last.getFullYear() || getWeek(now) !== getWeek(last);
  };

  useEffect(() => {
    (async () => {
      const [dailyReset, weeklyReset, storedMissions] = await Promise.all([
        AsyncStorage.getItem(DAILY_KEY),
        AsyncStorage.getItem(WEEKLY_KEY),
        AsyncStorage.getItem(MISSIONS_KEY),
      ]);

      let newMissions: Mission[] = [];

      const shouldResetDaily = isNewDay(dailyReset);
      const shouldResetWeekly = isNewWeek(weeklyReset);

      if (shouldResetDaily || shouldResetWeekly || !storedMissions) {
        newMissions = generateMissions();
        await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(newMissions));
        if (shouldResetDaily) await AsyncStorage.setItem(DAILY_KEY, new Date().toISOString());
        if (shouldResetWeekly) await AsyncStorage.setItem(WEEKLY_KEY, new Date().toISOString());
        setMissions(newMissions);
      } else {
        setMissions(JSON.parse(storedMissions));
      }

      setLoading(false);
    })();
  }, []);

  const saveMissions = async (updated: Mission[]) => {
    setMissions(updated);
    await AsyncStorage.setItem(MISSIONS_KEY, JSON.stringify(updated));
  };

  return { missions, setMissions: saveMissions, loading };
}
