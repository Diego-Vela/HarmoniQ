// hooks/useXpSound.ts
import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

export const playXpSound = async () => {
  let sound: Audio.Sound | undefined;

  try {
    const { sound: createdSound } = await Audio.Sound.createAsync(sounds.correct);
    sound = createdSound;
    await sound.playAsync();

    // Wait for the sound to finish playing and release resources
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound?.unloadAsync();
      }
    });
  } catch (err) {
    console.error('[XP Sound Error]', err);

    // Ensure resources are released in case of an error
    if (sound) {
      await sound.unloadAsync();
    }
  }
};
