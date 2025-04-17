import { create } from 'zustand';
import { RhythmStore } from '@/constants/types';

export const useRhythmStore = create<RhythmStore>((set) => ({
  calibrationOffset: 0, // Default offset is 0
  setCalibrationOffset: (offset: number) => set({ calibrationOffset: offset }),
}));