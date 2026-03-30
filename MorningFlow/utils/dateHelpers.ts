import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const getTodayDateString = () => {
  // Returns formatted YYYY-MM-DD for storage keys
  return format(new Date(), 'yyyy-MM-dd');
};

export const getFormattedGreetingDate = () => {
  // Returns formatted date for header e.g. "Monday, October 12"
  return format(new Date(), 'EEEE, MMMM d');
};

export const calculateStreak = (historyDates: string[]) => {
  // dates should be sorted descending
  if (!historyDates || historyDates.length === 0) return 0;

  const sortedDates = [...historyDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let currentStreak = 0;
  let prevDateStr = '';

  for (let i = 0; i < sortedDates.length; i++) {
    const dateStr = sortedDates[i];
    const dateObj = parseISO(dateStr);

    if (i === 0) {
      if (isToday(dateObj) || isYesterday(dateObj)) {
        currentStreak++;
      } else {
        break; // Streak broken
      }
    } else {
       // Check if consecutive
       const expectedPrevDate = new Date(parseISO(prevDateStr));
       expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
       if (format(expectedPrevDate, 'yyyy-MM-dd') === dateStr) {
         currentStreak++;
       } else {
         break;
       }
    }
    prevDateStr = dateStr;
  }

  return currentStreak;
};
