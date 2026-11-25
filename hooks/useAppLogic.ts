import { useState } from 'react';
import { AppState, TrainingData } from '../types';
import {
  exportTrainingRecordJson,
  getTrainingData,
  hasWorkedOutToday,
  importTrainingRecordJson,
  recordWorkoutCompletion,
  resetTrainingData,
  updateCustomVideo,
} from '../services/storageService';
import { registerFavoriteVideo } from '../services/videoProvider';
import { getEncouragementMessage } from '../services/trainerMessages';

export const useAppLogic = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [trainingData, setTrainingData] = useState<TrainingData>(() =>
    getTrainingData()
  );
  const [trainerMessage, setTrainerMessage] = useState<string>('');
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() =>
    hasWorkedOutToday()
  );
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentVideo = trainingData.customVideo;

  const syncStateFromStorage = (data: TrainingData) => {
    setTrainingData(data);
    setIsCompletedToday(hasWorkedOutToday());
  };

  const handleRegisterVideo = async () => {
    if (!inputUrl.trim()) return;
    setIsRegistering(true);
    setErrorMsg(null);
    try {
      await registerFavoriteVideo(inputUrl);
      setTrainingData(getTrainingData());
      setInputUrl('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '動画の登録に失敗しました';
      setErrorMsg(message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleChangeVideo = () => {
    setTrainerMessage('');
    const updated = updateCustomVideo(null);
    setTrainingData(updated);
  };

  const handleStartWorkout = () => {
    if (currentVideo) {
      setAppState(AppState.PLAYING);
    }
  };

  const handleCompleteWorkout = () => {
    const updated = recordWorkoutCompletion(currentVideo);
    setTrainingData(updated);
    setIsCompletedToday(true);
    setTrainerMessage(getEncouragementMessage(updated.currentStreakDays));
    setAppState(AppState.COMPLETED);
  };

  const handleBackHome = () => {
    setAppState(AppState.HOME);
    syncStateFromStorage(getTrainingData());
  };

  const handleExportJson = (): string => {
    const { filename, data } = exportTrainingRecordJson();
    setTrainingData(data);
    return filename;
  };

  const handleImportJson = async (file: File): Promise<TrainingData> => {
    const text = await file.text();
    const imported = importTrainingRecordJson(text);
    syncStateFromStorage(imported);
    setErrorMsg(null);
    return imported;
  };

  const handleResetData = () => {
    const fresh = resetTrainingData();
    syncStateFromStorage(fresh);
    setTrainerMessage('');
    setAppState(AppState.HOME);
  };

  return {
    appState,
    trainingData,
    currentVideo,
    trainerMessage,
    isCompletedToday,
    inputUrl,
    setInputUrl,
    isRegistering,
    errorMsg,
    handleRegisterVideo,
    handleChangeVideo,
    handleStartWorkout,
    handleCompleteWorkout,
    handleBackHome,
    handleExportJson,
    handleImportJson,
    handleResetData,
  };
};
