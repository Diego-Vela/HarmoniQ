import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return <Text className="text-white text-3xl font-bold">{formatTime(secondsLeft)}</Text>;
};

export default Timer;
