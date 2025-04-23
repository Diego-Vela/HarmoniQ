import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMissions } from '@/stores/useMissionsStore';
import { isNewDay, isNewWeek } from '@/utils/date-utils';

const LAST_DAILY_KEY = 'last-daily-refresh';
const LAST_WEEKLY_KEY = 'last-weekly-refresh';

export async function initMissions() {
  const {
    lastDailyKey,
    lastWeeklyKey,
    generateDailyMissions,
    generateWeeklyMissions,
    resetDailyMissions,
    resetWeeklyMissions,
    updateLastDailyKey,
    updateLastWeeklyKey,
  } = useMissions.getState();

  const now = new Date();
  const todayStr = now.toDateString();

  const shouldResetDaily = !lastDailyKey || isNewDay(new Date(lastDailyKey), now);
  const shouldResetWeekly = !lastWeeklyKey || isNewWeek(new Date(lastWeeklyKey), now);

  if (!shouldResetDaily && !shouldResetWeekly) {
    // console.log('Missions are already up-to-date.');
    return; 
  }

  const state = useMissions.getState();
  const hasNoMissions =
    state.dailyMissions.length === 0 && state.weeklyMissions.length === 0;

  if (shouldResetDaily || shouldResetWeekly || hasNoMissions) {
    if (shouldResetDaily || hasNoMissions) {
      // console.log('Resetting Daily Missions...');
      resetDailyMissions();
      generateDailyMissions(3);
      // console.log('Generated Daily Missions:', useMissions.getState().dailyMissions);
      updateLastDailyKey(todayStr); // Update the key in the store
      // console.log('Updated Last Daily Key:', todayStr);
    }

    if (shouldResetWeekly || hasNoMissions) {
      // console.log('Resetting Weekly Missions...');
      resetWeeklyMissions();
      generateWeeklyMissions(1);
      // console.log('Generated Weekly Missions:', useMissions.getState().weeklyMissions);
      updateLastWeeklyKey(todayStr); // Update the key in the store
      //console.log('Updated Last Weekly Key:', todayStr);
    }
  } else {
    // console.log('Missions are up-to-date. No reset needed.');
  }

  // Initialize missing keys without resetting missions
  if (!lastDailyKey) {
    //console.log('Initializing Last Daily Key...');
    updateLastDailyKey(todayStr);
    //console.log('Initialized Last Daily Key:', todayStr);
  }

  if (!lastWeeklyKey) {
    //console.log('Initializing Last Weekly Key...');
    updateLastWeeklyKey(todayStr);
    //console.log('Initialized Last Weekly Key:', todayStr);
  }

  //console.log('Final State:');
  //console.log('Daily Missions:', useMissions.getState().dailyMissions);
  //console.log('Weekly Missions:', useMissions.getState().weeklyMissions);
}
