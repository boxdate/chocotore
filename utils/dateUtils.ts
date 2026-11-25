/**
 * Returns today's date string in YYYY-MM-DD format based on UTC.
 * Since JST is UTC+9, this effectively means the "day" switches at 9:00 AM JST.
 */
export const getTodayDateString = (now: Date = new Date()): string => {
  return now.toISOString().split('T')[0];
};

/**
 * Returns the date string for N days ago based on UTC.
 */
export const getPastDateString = (
  daysAgo: number,
  now: Date = new Date()
): string => {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

/**
 * Formats an ISO timestamp into a short Japanese local date/time string for display.
 */
export const formatJapaneseDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
