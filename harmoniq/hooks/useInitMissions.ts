import { useEffect } from 'react';
import { AppState } from 'react-native';
import { initMissions } from '@/utils/init-missions-util';

export function useInitMissions() {
  useEffect(() => {
    initMissions(); // initial check on boot

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        initMissions(); // check again when returning to app
      }
    });

    return () => subscription.remove();
  }, []);
}
