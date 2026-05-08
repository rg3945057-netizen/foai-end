/**
 * Format a Date or timestamp to a readable string.
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a Date or timestamp to time string.
 */
export function formatTime(dateStr) {
  if (!dateStr) return '--:--';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format a timestamp to "X minutes ago" style.
 */
export function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(n) {
  if (n === null || n === undefined) return '--';
  return n.toLocaleString();
}

/**
 * Format coordinate to 4 decimal places.
 */
export function formatCoord(val) {
  if (val === null || val === undefined) return '--';
  return parseFloat(val).toFixed(4);
}
