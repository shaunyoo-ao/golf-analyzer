/**
 * Compute months of golf experience since account was created.
 * @param {Date|string|import('firebase/firestore').Timestamp} createdAt
 * @returns {number}
 */
export function golfExperienceMonths(createdAt) {
  if (!createdAt) return 0;
  let date;
  if (createdAt?.toDate) {
    date = createdAt.toDate();
  } else {
    date = new Date(createdAt);
  }
  const now = new Date();
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  return Math.max(0, months);
}

/**
 * Format a date string (YYYY-MM-DD) to locale display.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y}.${m}.${d}`;
}

/** Today as YYYY-MM-DD */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
/** Returns 3-letter day abbreviation for a YYYY-MM-DD string */
export function dayOfWeek(dateStr) {
  return DAYS_SHORT[new Date(dateStr + 'T12:00:00').getDay()];
}
