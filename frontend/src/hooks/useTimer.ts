import { useEffect, useState } from 'react';

interface UseTimerProps {
  duration: number;
  isRunning: boolean;
  onTimerEnd?: () => void;
}

export const useTimer = ({ duration, isRunning = true, onTimerEnd }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          onTimerEnd?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimerEnd]);

  const resetTimer = (newTime?: number) => {
    setTimeLeft(newTime !== undefined ? newTime : duration);
  };

  return {
    timeLeft,
    resetTimer,
  };
};
