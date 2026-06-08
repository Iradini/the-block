import { vi } from 'vitest';
import { FIXED_NOW } from '../fixtures/vehicles';

export function withFixedTime(isoDate: string | Date, fn: () => void): void {
  vi.useFakeTimers();
  vi.setSystemTime(typeof isoDate === 'string' ? new Date(isoDate) : isoDate);
  try {
    fn();
  } finally {
    vi.useRealTimers();
  }
}

export function withDefaultFixedTime(fn: () => void): void {
  withFixedTime(FIXED_NOW, fn);
}
