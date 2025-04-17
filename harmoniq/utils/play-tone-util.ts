import { Audio } from 'expo-av';
import { sounds } from '@/constants/sounds';

// Dynamically generate MIDI to note name map
const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
export const midiToNoteName: Record<number, string> = {};

for (let midi = 48; midi <= 84; midi++) {
  const octave = Math.floor(midi / 12) - 1;
  const name = noteNames[midi % 12];
  midiToNoteName[midi] = `${name}${octave}`;
}

// Play sound for a given MIDI note number
export const playTone = async (midiNote: number) => {
  if (midiNote < 48 || midiNote > 84) {
    console.log(`MIDI note ${midiNote} is out of range (48-84).`);
    return;
  }

  const noteKey = midiToNoteName[midiNote];
  const soundFile = sounds[noteKey];

  if (!soundFile) {
    console.warn(`Sound for MIDI note ${midiNote} (${noteKey}) not found.`);
    return;
  }

  let sound: Audio.Sound | undefined;

  try {
    const { sound: createdSound } = await Audio.Sound.createAsync(soundFile);
    sound = createdSound;
    await sound.playAsync();

    // Wait for the sound to finish playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound?.unloadAsync(); // Release resources
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
    if (sound) {
      await sound.unloadAsync(); // Ensure resources are released in case of an error
    }
  }
};
