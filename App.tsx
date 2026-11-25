import React, { useState } from 'react';
import { AppState } from './types';
import { useAppLogic } from './hooks/useAppLogic';
import { VideoPlayer } from './components/VideoPlayer';
import { AppInfoModal } from './components/AppInfoModal';
import { SettingsModal } from './components/SettingsModal';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { CompletedView } from './views/CompletedView';

const App: React.FC = () => {
  const logic = useAppLogic();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-choco-100 flex flex-col pt-16 text-choco-900 font-sans">
      <Header
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <AppInfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        trainingData={logic.trainingData}
        onExportJson={logic.handleExportJson}
        onImportJson={logic.handleImportJson}
        onResetData={logic.handleResetData}
      />

      <main className="flex-1 flex flex-col items-center p-6 max-w-md mx-auto w-full">
        {logic.appState === AppState.HOME && (
          <HomeView
            trainingData={logic.trainingData}
            currentVideo={logic.currentVideo}
            isCompletedToday={logic.isCompletedToday}
            inputUrl={logic.inputUrl}
            isRegistering={logic.isRegistering}
            errorMsg={logic.errorMsg}
            onInputUrlChange={logic.setInputUrl}
            onRegisterVideo={logic.handleRegisterVideo}
            onStartWorkout={logic.handleStartWorkout}
            onChangeVideo={logic.handleChangeVideo}
            onExportJson={logic.handleExportJson}
            onImportJson={logic.handleImportJson}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {logic.appState === AppState.PLAYING && logic.currentVideo && (
          <VideoPlayer
            video={logic.currentVideo}
            onComplete={logic.handleCompleteWorkout}
          />
        )}

        {logic.appState === AppState.COMPLETED && (
          <CompletedView
            trainingData={logic.trainingData}
            trainerMessage={logic.trainerMessage}
            onBackHome={logic.handleBackHome}
            onExportJson={logic.handleExportJson}
          />
        )}
      </main>

      <footer className="w-full text-center py-4 text-choco-400 text-xs font-medium opacity-80">
        <p>&copy; {new Date().getFullYear()} boxdate</p>
      </footer>
    </div>
  );
};

export default App;
