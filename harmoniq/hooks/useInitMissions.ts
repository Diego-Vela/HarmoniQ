import { useEffect } from 'react';
import { useMissions } from './useMissions';
import { isNewDay, isNewWeek } from '@/utils/date-utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_REFRESH_KEY = 'last-mission-refresh';

export function useInitMissions() {
  const {
    generateDailyMissions,
    generateWeeklyMissions,
    resetAllMissions,
  } = useMissions();

  useEffect(() => {
    const init = async () => {
      const now = new Date();
      const todayStr = now.toDateString();

      const lastRefresh = await AsyncStorage.getItem(LAST_REFRESH_KEY);
      const lastRefreshDate = lastRefresh ? new Date(lastRefresh) : null;

      const shouldResetDaily = !lastRefreshDate || isNewDay(lastRefreshDate, now);
      const shouldResetWeekly = !lastRefreshDate || isNewWeek(lastRefreshDate, now);
      
      const state = useMissions.getState();
      const hasNoMissions =
        state.dailyMissions.length === 0 && state.weeklyMissions.length === 0;

      if (shouldResetDaily || shouldResetWeekly || hasNoMissions) {
        resetAllMissions();
      
        if (shouldResetDaily || hasNoMissions) {
          generateDailyMissions(3);
        }
      
        if (shouldResetWeekly || hasNoMissions) {
          generateWeeklyMissions(2);
        }
      
        await AsyncStorage.setItem(LAST_REFRESH_KEY, todayStr);
      }
    };

    init();
  }, []);
}
