import { useEffect } from 'react';
import { useMissions } from '@/stores/useMissionsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isNewDay, isNewWeek } from '@/utils/date-utils';

const LAST_DAILY_KEY = 'last-daily-refresh';
const LAST_WEEKLY_KEY = 'last-weekly-refresh';

export function useInitMissions() {
  const {
    generateDailyMissions,
    generateWeeklyMissions,
    resetDailyMissions,
    resetWeeklyMissions,
  } = useMissions();

  useEffect(() => {
    const init = async () => {
      const now = new Date();
      const todayStr = now.toDateString();

      const [lastDailyStr, lastWeeklyStr] = await Promise.all([
        AsyncStorage.getItem(LAST_DAILY_KEY),
        AsyncStorage.getItem(LAST_WEEKLY_KEY),
      ]);

      const lastDailyDate = lastDailyStr ? new Date(lastDailyStr) : null;
      const lastWeeklyDate = lastWeeklyStr ? new Date(lastWeeklyStr) : null;

      const shouldResetDaily = !lastDailyDate || isNewDay(lastDailyDate, now);
      const shouldResetWeekly = !lastWeeklyDate || isNewWeek(lastWeeklyDate, now);

      const state = useMissions.getState();
      const hasNoMissions =
        state.dailyMissions.length === 0 && state.weeklyMissions.length === 0;

      if (shouldResetDaily || shouldResetWeekly || hasNoMissions) {

        if (shouldResetDaily || hasNoMissions) {
          resetDailyMissions();
          generateDailyMissions(3);
          await AsyncStorage.setItem(LAST_DAILY_KEY, todayStr);
        }

        if (shouldResetWeekly || hasNoMissions) {
          resetWeeklyMissions();
          generateWeeklyMissions(2);
          await AsyncStorage.setItem(LAST_WEEKLY_KEY, todayStr);
        }
      }
    };

    init();
  }, []);
}
