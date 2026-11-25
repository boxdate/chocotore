import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileJson,
  Link as LinkIcon,
  PlayCircle,
  Settings,
  Upload,
} from 'lucide-react';
import { TrainingData, TrainingVideo } from '../types';
import { StreakCounter } from '../components/StreakCounter';

interface Props {
  trainingData: TrainingData;
  currentVideo: TrainingVideo | null;
  isCompletedToday: boolean;
  inputUrl: string;
  isRegistering: boolean;
  errorMsg: string | null;
  onInputUrlChange: (val: string) => void;
  onRegisterVideo: () => void;
  onStartWorkout: () => void;
  onChangeVideo: () => void;
  onExportJson: () => string;
  onImportJson: (file: File) => Promise<TrainingData>;
  onOpenSettings: () => void;
}

export const HomeView: React.FC<Props> = ({
  trainingData,
  currentVideo,
  isCompletedToday,
  inputUrl,
  isRegistering,
  errorMsg,
  onInputUrlChange,
  onRegisterVideo,
  onStartWorkout,
  onChangeVideo,
  onExportJson,
  onImportJson,
  onOpenSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const isRegistrationNeeded = !currentVideo;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const imported = await onImportJson(file);
      setImportStatus({
        type: 'success',
        text: `記録を読み込みました（連続 ${imported.currentStreakDays} 日）`,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'JSONファイルの読み込みに失敗しました';
      setImportStatus({
        type: 'error',
        text: message,
      });
    }
  };

  const handleQuickExport = () => {
    const filename = onExportJson();
    setImportStatus({
      type: 'success',
      text: `${filename} を保存しました！`,
    });
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 animate-in fade-in duration-500">
      {/* Registration Form */}
      {isRegistrationNeeded && (
        <>
          <div className="w-full bg-white p-8 rounded-3xl shadow-sm border border-choco-100 flex flex-col items-center text-center mt-4">
            <div className="bg-choco-100 p-4 rounded-full mb-4">
              <LinkIcon className="text-choco-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-choco-800 mb-2">
              動画をセットしよう
            </h2>
            <p className="text-sm text-choco-500 mb-6">
              毎日続けたいYouTube動画の
              <br />
              URLを入力してください。
            </p>
            <div className="w-full space-y-3">
              <input
                type="text"
                placeholder="https://youtu.be/..."
                value={inputUrl}
                onChange={(e) => onInputUrlChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputUrl && !isRegistering) {
                    onRegisterVideo();
                  }
                }}
                className="w-full p-4 rounded-xl border border-choco-200 bg-choco-50 text-choco-900 focus:outline-none focus:ring-2 focus:ring-choco-400 placeholder-choco-300"
              />
              {errorMsg && (
                <div className="flex items-center text-red-500 text-xs font-bold">
                  <AlertCircle size={12} className="mr-1" />
                  {errorMsg}
                </div>
              )}
              <button
                onClick={onRegisterVideo}
                disabled={isRegistering || !inputUrl}
                className={`w-full py-4 rounded-full font-bold shadow-lg transition-all flex items-center justify-center
                  ${
                    isRegistering || !inputUrl
                      ? 'bg-choco-300 text-choco-100 cursor-not-allowed'
                      : 'bg-choco-600 hover:bg-choco-700 text-white transform hover:scale-105 active:scale-95'
                  }`}
              >
                {isRegistering ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  '登録して始める'
                )}
              </button>
            </div>
          </div>

          <div className="w-full bg-white/80 p-5 rounded-3xl border border-choco-100 text-center space-y-3">
            <p className="text-xs text-choco-500 font-medium">
              保存済みの記録ファイルをお持ちですか？
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-full bg-white border border-choco-200 hover:bg-choco-50 text-choco-700 font-bold text-sm shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Upload size={16} />
              <span>JSONファイルから記録を読み込む</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </>
      )}

      {/* Video Preview */}
      {currentVideo && (
        <>
          <StreakCounter data={trainingData} highlight={isCompletedToday} />

          <div
            className="w-full relative group cursor-pointer"
            onClick={onStartWorkout}
          >
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white relative bg-black">
              <img
                src={
                  currentVideo.thumbnailUrl ||
                  `https://img.youtube.com/vi/${currentVideo.videoId}/hqdefault.jpg`
                }
                alt="Thumbnail"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle
                  size={64}
                  className="text-white fill-white/20 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                <p className="text-white font-bold text-sm line-clamp-1">
                  {currentVideo.title}
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              {isCompletedToday ? (
                <p className="text-choco-400 font-bold text-sm">
                  明日も頑張りましょう！
                </p>
              ) : (
                <p className="text-choco-600 font-bold animate-bounce text-sm">
                  画像をタップしてスタート！
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={onChangeVideo}
              className="text-choco-500 text-xs flex items-center hover:text-choco-700 transition-colors bg-white/70 border border-choco-100 px-3 py-1.5 rounded-full font-medium"
            >
              <Settings size={12} className="mr-1" />
              動画を変更する
            </button>

            <button
              onClick={handleQuickExport}
              className="text-choco-600 text-xs flex items-center hover:text-choco-800 transition-colors bg-white/70 border border-choco-100 px-3 py-1.5 rounded-full font-medium"
            >
              <Download size={12} className="mr-1" />
              記録をJSON保存
            </button>

            <button
              onClick={onOpenSettings}
              className="text-choco-500 text-xs flex items-center hover:text-choco-700 transition-colors bg-white/70 border border-choco-100 px-3 py-1.5 rounded-full font-medium"
            >
              <FileJson size={12} className="mr-1" />
              記録管理
            </button>
          </div>
        </>
      )}

      {importStatus && (
        <div
          className={`w-full flex items-center gap-2 p-3 rounded-2xl text-xs font-bold ${
            importStatus.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {importStatus.type === 'success' ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          <span>{importStatus.text}</span>
        </div>
      )}
    </div>
  );
};
