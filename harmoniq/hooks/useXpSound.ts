// hooks/useXpSound.ts
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

export const playXpSound = async () => {
  try {
    const sound = new Audio.Sound();
    await sound.loadAsync(sounds.correct);
    await sound.playAsync();
    setTimeout(() => sound.unloadAsync(), 2000);
  } catch (err) {
    console.error('[XP Sound Error]', err);
  }
};
