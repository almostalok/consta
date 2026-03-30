import { useState, useEffect, useCallback } from 'react';
import { getData, storeData } from '../utils/storage';
import { getTodayDateString } from '../utils/dateHelpers';
import { DEFAULT_CHECKLIST } from '../constants/exercises';

export interface RoutineProgress {
  workout: boolean;
  facial: boolean;
  vocal: boolean;
  posture: boolean;
  checklist: boolean;
  checklistItems: { id: string; title: string; completed: boolean }[];
}

const defaultProgress: RoutineProgress = {
  workout: false,
  facial: false,
  vocal: false,
  posture: false,
  checklist: false,
  checklistItems: DEFAULT_CHECKLIST,
};

export const useRoutineStore = () => {
  const [progress, setProgress] = useState<RoutineProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [streak, setStreak] = useState(0);

  const todayKey = `progress_${getTodayDateString()}`;

  const loadData = useCallback(async () => {
    try {
      const storedProgress = await getData<RoutineProgress>(todayKey);
      if (storedProgress) {
        setProgress(storedProgress);
      } else {
        setProgress(defaultProgress); // new day
      }

      const name = await getData<string>('user_name');
      if (name) setUserName(name);

      const historyDates = await getData<string[]>('completed_history') || [];
      // calculate streak logic goes here using dateHelpers, simplified for now
      setStreak(historyDates.length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [todayKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveProgress = async (newProgress: RoutineProgress) => {
    setProgress(newProgress);
    await storeData(todayKey, newProgress);
  };

  const markModuleComplete = async (module: keyof Omit<RoutineProgress, 'checklistItems'>) => {
    const newProgress = { ...progress, [module]: true };
    await saveProgress(newProgress);
    
    // Check if everything is done today
    if (newProgress.workout && newProgress.facial && newProgress.vocal && newProgress.posture && newProgress.checklist) {
       markDayComplete();
    }
  };

  const markDayComplete = async () => {
     const historyDates = await getData<string[]>('completed_history') || [];
     const today = getTodayDateString();
     if (!historyDates.includes(today)) {
       const newHistory = [...historyDates, today];
       await storeData('completed_history', newHistory);
       setStreak(newHistory.length); // simplified streak logic
     }
  };

  const setUserNameAndSave = async (name: string) => {
    setUserName(name);
    await storeData('user_name', name);
  };

  return {
    progress,
    loading,
    userName,
    streak,
    markModuleComplete,
    saveProgress,
    setUserName: setUserNameAndSave,
    refresh: loadData
  };
};
