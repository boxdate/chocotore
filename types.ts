export enum AppState {
  HOME = 'HOME',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
}

export interface TrainingVideo {
  videoId: string;
  youtubeUrl: string;
  title: string;
  targetMuscle: string;
  thumbnailUrl?: string;
}

export interface TrainingLog {
  /** YYYY-MM-DD (UTC, switching at 9:00 AM JST) */
  date: string;
  /** ISO 8601 timestamp */
  completedAt: string;
  videoId?: string;
  videoTitle?: string;
}

export interface TrainingData {
  currentStreakDays: number;
  longestStreakDays: number;
  lastCompletedDate: string | null;
  customVideo: TrainingVideo | null;
  logs: TrainingLog[];
  lastExportedAt: string | null;
}

export interface TrainingRecordFile {
  app: 'chocotore';
  version: 1;
  exportedAt: string;
  currentStreakDays: number;
  longestStreakDays: number;
  lastCompletedDate: string | null;
  customVideo: TrainingVideo | null;
  logs: TrainingLog[];
}
