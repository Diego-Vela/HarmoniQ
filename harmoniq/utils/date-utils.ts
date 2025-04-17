export function isNewDay(last: Date, now: Date): boolean {
  return last.toDateString() !== now.toDateString();
}

export function isNewWeek(last: Date, now: Date): boolean {
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    return new Date(d.getFullYear(), d.getMonth(), diff).toDateString();
  };

  return getWeekStart(last) !== getWeekStart(now);
}

