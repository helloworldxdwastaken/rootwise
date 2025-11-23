/**
 * Timezone Configuration for Rootwise
 * 
 * User Location: Israel / Cyprus
 * Timezone: Asia/Jerusalem (Israel Standard Time - IST)
 * UTC Offset: UTC+2 (standard) / UTC+3 (daylight saving)
 */

export const USER_TIMEZONE = 'Asia/Jerusalem';

/**
 * Get the current date in the user's timezone (Israel)
 * Returns date components in local time
 */
export function getLocalDate(date: Date = new Date()): {
  year: number;
  month: number; // 0-11
  day: number;
  dateString: string; // YYYY-MM-DD
  dateKey: string; // health_YYYY-MM-DD
} {
  // Convert to Israel timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: USER_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1; // 0-indexed
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
  
  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dateKey = `health_${dateString}`;
  
  return { year, month, day, dateString, dateKey };
}

/**
 * Get the current time in the user's timezone (Israel)
 */
export function getLocalTime(date: Date = new Date()): string {
  return date.toLocaleString('en-US', {
    timeZone: USER_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Get a date range for the past N days in the user's timezone
 */
export function getDateRange(days: number): Array<{ dateKey: string; dateString: string; dayName: string }> {
  const result: Array<{ dateKey: string; dateString: string; dayName: string }> = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const { dateString, dateKey } = getLocalDate(date);
    const dayName = date.toLocaleDateString('en-US', {
      timeZone: USER_TIMEZONE,
      weekday: 'short',
    });
    
    result.push({ dateKey, dateString, dayName });
  }
  
  return result;
}

/**
 * Create a Date object for midnight in the user's timezone
 */
export function getMidnightInLocalTimezone(dateString: string): Date {
  // Parse YYYY-MM-DD and create a date at midnight in Israel timezone
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create date string in ISO format for Israel timezone
  // Israel is UTC+2 (standard) or UTC+3 (DST)
  // We'll use a localized approach
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  return date;
}

