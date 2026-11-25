import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildTrainingRecordFile,
  getTrainingData,
  hasWorkedOutToday,
  importTrainingRecordJson,
  parseAndValidateTrainingRecordFile,
  recordWorkoutCompletion,
  resetTrainingData,
  STORAGE_KEY,
  updateCustomVideo,
} from './storageService';
import { TrainingVideo } from '../types';

const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
};

const sampleVideo: TrainingVideo = {
  videoId: 'dQw4w9WgXcQ',
  youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ',
  title: 'Test Workout',
  targetMuscle: 'Custom Routine',
};

describe('storageService', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMemoryStorage(),
      configurable: true,
      writable: true,
    });
  });

  it('initializes empty training data when storage is empty', () => {
    const data = getTrainingData();
    expect(data.currentStreakDays).toBe(0);
    expect(data.longestStreakDays).toBe(0);
    expect(data.lastCompletedDate).toBeNull();
    expect(data.customVideo).toBeNull();
    expect(data.logs).toEqual([]);
  });

  it('increments streak across consecutive days and avoids double-counting same day', () => {
    updateCustomVideo(sampleVideo);

    const day1 = new Date('2026-11-20T10:00:00.000Z');
    const afterDay1 = recordWorkoutCompletion(sampleVideo, day1);
    expect(afterDay1.currentStreakDays).toBe(1);
    expect(afterDay1.longestStreakDays).toBe(1);
    expect(afterDay1.logs).toHaveLength(1);
    expect(hasWorkedOutToday(day1)).toBe(true);

    // Same UTC day: should not increment streak or duplicate log
    const day1Later = new Date('2026-11-20T18:00:00.000Z');
    const afterDay1Later = recordWorkoutCompletion(sampleVideo, day1Later);
    expect(afterDay1Later.currentStreakDays).toBe(1);
    expect(afterDay1Later.logs).toHaveLength(1);

    // Next consecutive day
    const day2 = new Date('2026-11-21T10:00:00.000Z');
    const afterDay2 = recordWorkoutCompletion(sampleVideo, day2);
    expect(afterDay2.currentStreakDays).toBe(2);
    expect(afterDay2.longestStreakDays).toBe(2);
    expect(afterDay2.logs).toHaveLength(2);

    // Skipped a day: streak resets to 1, longest stays 2
    const day4 = new Date('2026-11-23T10:00:00.000Z');
    const afterDay4 = recordWorkoutCompletion(sampleVideo, day4);
    expect(afterDay4.currentStreakDays).toBe(1);
    expect(afterDay4.longestStreakDays).toBe(2);
    expect(afterDay4.logs).toHaveLength(3);
  });

  it('exports and imports a valid JSON training record file', () => {
    const day1 = new Date('2026-11-24T10:00:00.000Z');
    updateCustomVideo(sampleVideo);
    recordWorkoutCompletion(sampleVideo, day1);
    const current = getTrainingData();
    const recordFile = buildTrainingRecordFile(current, day1);

    resetTrainingData();
    expect(getTrainingData().logs).toEqual([]);

    const imported = importTrainingRecordJson(JSON.stringify(recordFile));
    expect(imported.currentStreakDays).toBe(1);
    expect(imported.customVideo?.videoId).toBe(sampleVideo.videoId);
    expect(imported.logs).toHaveLength(1);
    expect(imported.logs[0].date).toBe('2026-11-24');
  });

  it('rejects invalid JSON or unrelated JSON objects', () => {
    expect(() => parseAndValidateTrainingRecordFile('{invalid')).toThrow();
    expect(() =>
      parseAndValidateTrainingRecordFile('{"name":"not-chocotore"}')
    ).toThrow();
    expect(() =>
      parseAndValidateTrainingRecordFile('{"app":"other-app"}')
    ).toThrow();
  });

  it('migrates legacy v4 localStorage data seamlessly', () => {
    localStorage.setItem(
      'chocotore_user_setting_v4',
      JSON.stringify({
        userId: 'old-uid',
        currentStreakDays: 4,
        longestStreakDays: 7,
        lastCompletedDate: '2026-11-24T12:00:00.000Z',
        customVideo: sampleVideo,
        selectedMode: 'STATIC_FIXED',
      })
    );

    const migrated = getTrainingData();
    expect(migrated.currentStreakDays).toBe(4);
    expect(migrated.longestStreakDays).toBe(7);
    expect(migrated.customVideo?.videoId).toBe(sampleVideo.videoId);
    expect(migrated.logs).toHaveLength(1);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });
});
