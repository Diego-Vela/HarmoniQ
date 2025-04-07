import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getXPForLevel } from '@/utils/xp-helpers';

type XPState = {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
};

type XPContextType = XPState & {
  claimXP: (amount: number) => void;
};

export const XPContext = createContext<XPContextType | undefined>(undefined);

export const XPProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<XPState>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: getXPForLevel(1),
    streak: 0,
  });

  const claimXP = (amount: number) => {
    setState(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;

      while (newXP >= xpToNext) {
        newXP -= xpToNext;
        newLevel += 1;
        xpToNext = getXPForLevel(newLevel);
      }

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        xpToNextLevel: xpToNext,
      };
    });
  };

  return (
    <XPContext.Provider value={{ ...state, claimXP }}>
      {children}
    </XPContext.Provider>
  );
};
