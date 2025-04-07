import { useContext } from 'react';
import { XPContext } from '@/context/xp-context';

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};
