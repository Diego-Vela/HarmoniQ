import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getXPForLevel } from '@/utils/xp-utils';

type XPState = {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
  totalXP: number; // 👈 new
  justLeveledUp: boolean;
};

type XPContextType = Omit<XPState, 'justLeveledUp'> & {
  claimXP: (amount: number) => void;
  justLeveledUp: boolean;
};

export const XPContext = createContext<XPContextType | undefined>(undefined);

export const XPProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<Omit<XPState, 'justLeveledUp'>>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: getXPForLevel(1),
    streak: 0,
    totalXP: 0, // 👈 new
  });

  const [justLeveledUp, setJustLeveledUp] = useState(false);

  const claimXP = (amount: number) => {
    setState(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;
      let leveledUp = false;
  
      while (newXP >= xpToNext) {
        newXP -= xpToNext;
        newLevel += 1;
        xpToNext = getXPForLevel(newLevel);
        leveledUp = true;
      }
  
      if (leveledUp) {
        setJustLeveledUp(true);
        setTimeout(() => setJustLeveledUp(false), 2000);
      }
  
      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        xpToNextLevel: xpToNext,
        totalXP: prev.totalXP + amount, // 👈 Add XP here
      };
    });
  };  

  return (
    <XPContext.Provider value={{ ...state, justLeveledUp, claimXP }}>
      {children}
    </XPContext.Provider>
  );
};
