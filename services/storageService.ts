import {
  TrainingData,
  TrainingLog,
  TrainingRecordFile,
  TrainingVideo,
} from '../types';
import { getPastDateString, getTodayDateString } from '../utils/dateUtils';

export const STORAGE_KEY = 'chocotore_training_data_v1';
const LEGACY_STORAGE_KEY = 'chocotore_user_setting_v4';

const createDefaultData = (): TrainingData => ({
  currentStreakDays: 0,
  longestStreakDays: 0,
  lastCompletedDate: null,
  customVideo: null,
  logs: [],
  lastExportedAt: null,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sanitizeNonNegativeInt = (value: unknown, fallback = 0): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
};

const sanitizeIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : value;
};

const sanitizeVideo = (value: unknown): TrainingVideo | null => {
  if (!isRecord(value)) return null;
  const { videoId, youtubeUrl, title, targetMuscle, thumbnailUrl } = value;
  if (
    typeof videoId !== 'string' ||
    !videoId.trim() ||
    typeof youtubeUrl !== 'string' ||
    !youtubeUrl.trim()
  ) {
    return null;
  }

  return {
    videoId: videoId.trim(),
    youtubeUrl: youtubeUrl.trim(),
    title: typeof title === 'string' && title.trim() ? title.trim() : 'My Daily Workout',
    targetMuscle:
      typeof targetMuscle === 'string' && targetMuscle.trim()
        ? targetMuscle.trim()
        : 'Custom Routine',
    thumbnailUrl:
      typeof thumbnailUrl === 'string' && thumbnailUrl.trim()
        ? thumbnailUrl.trim()
        : undefined,
  };
};

const sanitizeLogs = (value: unknown): TrainingLog[] => {
  if (!Array.isArray(value)) return [];

  const byDate = new Map<string, TrainingLog>();
  for (const item of value) {
    if (!isRecord(item)) continue;
    const date = typeof item.date === 'string' ? item.date.trim() : '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

    const completedAt =
      sanitizeIsoDateOrNull(item.completedAt) ?? `${date}T00:00:00.000Z`;

    const existing = byDate.get(date);
    if (!existing || completedAt > existing.completedAt) {
      byDate.set(date, {
        date,
        completedAt,
        videoId:
          typeof item.videoId === 'string' && item.videoId.trim()
            ? item.videoId.trim()
            : undefined,
        videoTitle:
          typeof item.videoTitle === 'string' && item.videoTitle.trim()
            ? item.videoTitle.trim()
            : undefined,
      });
    }
  }

  return Array.from(byDate.values()).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
};

const migrateFromLegacyStorage = (): TrainingData | null => {
  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacyRaw) return null;

  try {
    const parsed: unknown = JSON.parse(legacyRaw);
    if (!isRecord(parsed)) return null;

    const lastCompletedDate = sanitizeIsoDateOrNull(parsed.lastCompletedDate);
    const currentStreakDays = sanitizeNonNegativeInt(parsed.currentStreakDays);
    const longestStreakDays = Math.max(
      currentStreakDays,
      sanitizeNonNegativeInt(parsed.longestStreakDays)
    );
    const customVideo = sanitizeVideo(parsed.customVideo);

    const logs: TrainingLog[] = [];
    if (lastCompletedDate) {
      logs.push({
        date: lastCompletedDate.split('T')[0],
        completedAt: lastCompletedDate,
        videoId: customVideo?.videoId,
        videoTitle: customVideo?.title,
      });
    }

    const migrated: TrainingData = {
      currentStreakDays,
      longestStreakDays,
      lastCompletedDate,
      customVideo,
      logs,
      lastExportedAt: null,
    };

    saveTrainingData(migrated);
    return migrated;
  } catch {
    return null;
  }
};

export const getTrainingData = (): TrainingData => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const migrated = migrateFromLegacyStorage();
    if (migrated) return migrated;

    const initial = createDefaultData();
    saveTrainingData(initial);
    return initial;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      const initial = createDefaultData();
      saveTrainingData(initial);
      return initial;
    }

    const currentStreakDays = sanitizeNonNegativeInt(parsed.currentStreakDays);
    const longestStreakDays = Math.max(
      currentStreakDays,
      sanitizeNonNegativeInt(parsed.longestStreakDays)
    );

    return {
      currentStreakDays,
      longestStreakDays,
      lastCompletedDate: sanitizeIsoDateOrNull(parsed.lastCompletedDate),
      customVideo: sanitizeVideo(parsed.customVideo),
      logs: sanitizeLogs(parsed.logs),
      lastExportedAt: sanitizeIsoDateOrNull(parsed.lastExportedAt),
    };
  } catch {
    const initial = createDefaultData();
    saveTrainingData(initial);
    return initial;
  }
};

export const saveTrainingData = (data: TrainingData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateCustomVideo = (
  video: TrainingVideo | null
): TrainingData => {
  const current = getTrainingData();
  const next: TrainingData = {
    ...current,
    customVideo: video,
  };
  saveTrainingData(next);
  return next;
};

export const recordWorkoutCompletion = (
  video?: TrainingVideo | null,
  now: Date = new Date()
): TrainingData => {
  const current = getTrainingData();
  const todayStr = getTodayDateString(now);
  const storedLastDateDay = current.lastCompletedDate
    ? current.lastCompletedDate.split('T')[0]
    : '';

  const completedAt = now.toISOString();
  const activeVideo = video ?? current.customVideo;

  const nextLogs = sanitizeLogs([
    ...current.logs,
    {
      date: todayStr,
      completedAt,
      videoId: activeVideo?.videoId,
      videoTitle: activeVideo?.title,
    },
  ]);

  // Already worked out today: keep streak as-is, update logs if missing
  if (storedLastDateDay === todayStr) {
    const next: TrainingData = {
      ...current,
      logs: nextLogs,
    };
    saveTrainingData(next);
    return next;
  }

  const yesterdayStr = getPastDateString(1, now);
  const newStreak =
    storedLastDateDay === yesterdayStr ? current.currentStreakDays + 1 : 1;
  const newLongest = Math.max(newStreak, current.longestStreakDays);

  const next: TrainingData = {
    ...current,
    currentStreakDays: newStreak,
    longestStreakDays: newLongest,
    lastCompletedDate: completedAt,
    logs: nextLogs,
  };

  saveTrainingData(next);
  return next;
};

export const hasWorkedOutToday = (now: Date = new Date()): boolean => {
  const data = getTrainingData();
  if (!data.lastCompletedDate) return false;
  return data.lastCompletedDate.split('T')[0] === getTodayDateString(now);
};

export const buildTrainingRecordFile = (
  data: TrainingData,
  now: Date = new Date()
): TrainingRecordFile => ({
  app: 'chocotore',
  version: 1,
  exportedAt: now.toISOString(),
  currentStreakDays: data.currentStreakDays,
  longestStreakDays: data.longestStreakDays,
  lastCompletedDate: data.lastCompletedDate,
  customVideo: data.customVideo,
  logs: data.logs,
});

export const parseAndValidateTrainingRecordFile = (
  jsonText: string
): TrainingData => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('JSONファイルの形式が正しくありません。');
  }

  if (!isRecord(parsed)) {
    throw new Error('ちょこトレの記録ファイルではありません。');
  }

  if (parsed.app !== undefined && parsed.app !== 'chocotore') {
    throw new Error('ちょこトレの記録ファイルではありません。');
  }

  const hasKnownKey =
    parsed.app === 'chocotore' ||
    'logs' in parsed ||
    'customVideo' in parsed ||
    'currentStreakDays' in parsed;

  if (!hasKnownKey) {
    throw new Error('ちょこトレの記録ファイルではありません。');
  }

  if (parsed.logs !== undefined && !Array.isArray(parsed.logs)) {
    throw new Error('トレーニング履歴（logs）の形式が正しくありません。');
  }

  const logs = sanitizeLogs(parsed.logs);
  const currentStreakDays = sanitizeNonNegativeInt(parsed.currentStreakDays);
  const longestStreakDays = Math.max(
    currentStreakDays,
    sanitizeNonNegativeInt(parsed.longestStreakDays)
  );
  const lastCompletedDate =
    sanitizeIsoDateOrNull(parsed.lastCompletedDate) ??
    (logs.length > 0 ? logs[0].completedAt : null);

  return {
    currentStreakDays,
    longestStreakDays,
    lastCompletedDate,
    customVideo: sanitizeVideo(parsed.customVideo),
    logs,
    lastExportedAt: sanitizeIsoDateOrNull(parsed.exportedAt),
  };
};

export const importTrainingRecordJson = (jsonText: string): TrainingData => {
  const imported = parseAndValidateTrainingRecordFile(jsonText);
  saveTrainingData(imported);
  return imported;
};

export const exportTrainingRecordJson = (
  now: Date = new Date()
): { filename: string; data: TrainingData } => {
  const current = getTrainingData();
  const payload = buildTrainingRecordFile(current, now);
  const json = JSON.stringify(payload, null, 2);
  const filename = `chocotore-records-${getTodayDateString(now)}.json`;

  const updated: TrainingData = {
    ...current,
    lastExportedAt: payload.exportedAt,
  };
  saveTrainingData(updated);

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Delay revocation so mobile Safari/Chrome finish reading the blob
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return { filename, data: updated };
};

export const resetTrainingData = (): TrainingData => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  const fresh = createDefaultData();
  saveTrainingData(fresh);
  return fresh;
};
