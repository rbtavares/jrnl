import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in seconds into a human-readable relative time string
 * @param seconds - The number of seconds to format
 * @returns A formatted string (e.g., "30s", "5m", "2h", "3d")
 */
export function formatRelativeTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);

  // Less than 60 seconds: show as "Xs"
  if (absSeconds < 60) {
    return `now`;
  }

  // Less than 1 hour (3600 seconds): show as "Xm"
  if (absSeconds < 3600) {
    const minutes = Math.floor(absSeconds / 60);
    return `${minutes}m`;
  }

  // Less than 24 hours (86400 seconds): show as "Xh"
  if (absSeconds < 86400) {
    const hours = Math.floor(absSeconds / 3600);
    return `${hours}h`;
  }

  // 24 hours or more: show as "Xd"
  const days = Math.floor(absSeconds / 86400);
  return `${days}d`;
}
