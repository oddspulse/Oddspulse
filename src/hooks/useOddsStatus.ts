import { useState, useEffect, useCallback } from 'react';

export interface OddsApiStatus {
  lastFetchTime: string | null;
  nextAllowedFetchTime: string | null;
  monthlyCallCount: number;
  monthlyLimit: number;
  remaining: number;
  percentUsed: number;
  isNearLimit: boolean;
}

interface UseOddsStatusResult {
  status: OddsApiStatus | null;
  remainingMs: number | null;
  canRefreshNow: boolean;
  loading: boolean;
  error: string | null;
  refetchStatus: () => Promise<void>;
}

/**
 * Custom hook to fetch and track odds API status with real-time countdown
 *
 * Features:
 * - Fetches real timestamps from backend
 * - Live countdown that persists across page reloads
 * - Automatic refresh of status data
 * - Works in background while app is open
 */
export function useOddsStatus(autoRefreshInterval = 5000): UseOddsStatusResult {
  const [status, setStatus] = useState<OddsApiStatus | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch status from backend
  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/odds-status');

      if (!response.ok) {
        throw new Error('Failed to fetch odds status');
      }

      const data: OddsApiStatus = await response.json();
      setStatus(data);
      setLoading(false);
    } catch (err: any) {
      console.error('[useOddsStatus] Error fetching status:', err);
      setError(err.message || 'Failed to fetch status');
      setLoading(false);
    }
  }, []);

  // Update remaining time based on absolute timestamp
  const updateRemainingTime = useCallback(() => {
    if (!status?.nextAllowedFetchTime) {
      setRemainingMs(0);
      return;
    }

    const nextTime = new Date(status.nextAllowedFetchTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, nextTime - now);

    setRemainingMs(diff);
  }, [status?.nextAllowedFetchTime]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Update countdown every second
  useEffect(() => {
    if (!status?.nextAllowedFetchTime) {
      setRemainingMs(0);
      return;
    }

    // Initial update
    updateRemainingTime();

    // Update every second for live countdown
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [status?.nextAllowedFetchTime, updateRemainingTime]);

  // Optionally auto-refresh status from backend
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(fetchStatus, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchStatus]);

  const canRefreshNow = remainingMs !== null && remainingMs <= 0;

  return {
    status,
    remainingMs,
    canRefreshNow,
    loading,
    error,
    refetchStatus: fetchStatus,
  };
}

/**
 * Format remaining milliseconds into human-readable countdown
 * @param ms Milliseconds remaining
 * @returns Formatted string like "01:23:45" or "45 seconds"
 */
export function formatCountdown(ms: number | null): string {
  if (ms === null || ms <= 0) return 'Available now';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

/**
 * Format cache age in human-readable format
 */
export function formatCacheAge(ageMs: number | undefined): string | null {
  if (!ageMs) return null;

  const minutes = Math.floor(ageMs / (60 * 1000));
  if (minutes < 1) return 'Less than 1 minute ago';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m ago`;
}
