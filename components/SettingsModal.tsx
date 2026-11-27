import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  FileJson,
  History,
  Settings,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { TrainingData } from '../types';
import { formatJapaneseDateTime } from '../utils/dateUtils';
import { PwaInstallState } from '../hooks/usePwaInstall';
import { PwaInstallGuide } from './PwaInstallGuide';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trainingData: TrainingData;
  pwaInstall: PwaInstallState;
  onExportJson: () => string;
  onImportJson: (file: File) => Promise<TrainingData>;
  onResetData: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  trainingData,
  pwaInstall,
  onExportJson,
  onImportJson,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleAddToCalendar = () => {
    const appUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;

    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.append('action', 'TEMPLATE');
    calendarUrl.searchParams.append('text', '🍫 ちょこトレの時間！');
    calendarUrl.searchParams.append(
      'details',
      `さあ、今日も継続しよう！\n\n▼ アプリを開く\n${appUrl}`
    );

    window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer');
  };

  const handleExportClick = () => {
    const filename = onExportJson();
    setStatusMessage({
      type: 'success',
      text: `${filename} を保存しました！`,
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const imported = await onImportJson(file);
      setStatusMessage({
        type: 'success',
        text: `記録を読み込みました（累計 ${imported.logs.length} 日分 / 連続 ${imported.currentStreakDays} 日）`,
      });
      setConfirmReset(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'JSONファイルの読み込みに失敗しました';
      setStatusMessage({
        type: 'error',
        text: message,
      });
    }
  };

  const handleConfirmReset = () => {
    onResetData();
    setConfirmReset(false);
    setStatusMessage({
      type: 'success',
      text: '記録を初期化しました。',
    });
  };

  const recentLogs = trainingData.logs.slice(0, 7);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-choco-500 p-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Settings size={20} />
            <h2 className="font-bold text-lg">設定・記録管理</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-choco-900 overflow-y-auto max-h-[80vh]">
          {/* JSON Record Management Section */}
          <div>
            <h3 className="flex items-center font-bold text-choco-800 mb-2">
              <FileJson size={18} className="mr-2 text-choco-500" />
              トレーニング記録（JSONファイル）
            </h3>
            <div className="bg-choco-50 p-5 rounded-2xl border border-choco-100 space-y-4">
              <p className="text-sm text-choco-700 leading-relaxed">
                記録をスマホやパソコンにJSONファイルとして保存したり、保存したファイルから復元できます。
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-choco-100">
                <div>
                  <span className="text-choco-400 block">累計日数</span>
                  <span className="font-bold text-choco-800 text-sm">
                    {trainingData.logs.length} 日
                  </span>
                </div>
                <div>
                  <span className="text-choco-400 block">最終JSON保存</span>
                  <span className="font-bold text-choco-800">
                    {trainingData.lastExportedAt
                      ? formatJapaneseDateTime(trainingData.lastExportedAt)
                      : '未保存'}
                  </span>
                </div>
              </div>

              {statusMessage && (
                <div
                  className={`flex items-start gap-2 p-3 rounded-xl text-xs font-bold ${
                    statusMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={handleExportClick}
                  className="w-full bg-choco-600 hover:bg-choco-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Download size={16} />
                  <span>JSONファイルに保存</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white border border-choco-200 hover:bg-choco-100 text-choco-700 font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Upload size={16} />
                  <span>JSONファイルを読み込む</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {recentLogs.length > 0 && (
                <div className="pt-2 border-t border-choco-200/60">
                  <p className="flex items-center text-xs font-bold text-choco-600 mb-2">
                    <History size={14} className="mr-1" />
                    最近の記録（最新{recentLogs.length}件）
                  </p>
                  <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {recentLogs.map((log) => (
                      <li
                        key={log.date}
                        className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-lg border border-choco-100"
                      >
                        <span className="font-bold text-choco-700">
                          {log.date}
                        </span>
                        <span className="text-choco-500 truncate max-w-[170px]">
                          {log.videoTitle || 'トレーニング完了'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-choco-100"></div>

          {/* Reminder Section */}
          <div>
            <h3 className="flex items-center font-bold text-choco-800 mb-2">
              <Calendar size={18} className="mr-2 text-choco-500" />
              リマインダー設定
            </h3>
            <div className="bg-choco-50 p-5 rounded-2xl border border-choco-100 space-y-4">
              <p className="text-sm text-choco-700 leading-relaxed text-justify">
                Googleカレンダーに予定を追加して、毎日の運動を習慣化しましょう。
              </p>

              <button
                onClick={handleAddToCalendar}
                className="w-full bg-white border border-choco-200 hover:bg-choco-100 text-choco-700 font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <span className="mr-2">📅 Googleカレンダーに追加</span>
                <ExternalLink size={14} />
              </button>

              <div className="text-xs text-choco-500 space-y-1">
                <p>💡 ヒント：</p>
                <ul className="list-disc list-inside pl-1">
                  <li>カレンダーが開いたら、好きな時間を設定してください。</li>
                  <li>
                    <span className="font-bold">「毎日繰り返し」</span>
                    に設定すると通知が届き便利です。
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-choco-100"></div>

          {/* PWA Install Section */}
          <PwaInstallGuide pwaInstall={pwaInstall} variant="settings" />

          {/* Reset Section */}
          <div className="border-t border-choco-100 pt-4">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full text-xs text-red-500 hover:text-red-700 font-bold flex items-center justify-center space-x-1 py-2"
              >
                <Trash2 size={14} />
                <span>ブラウザ内の記録をリセットする</span>
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 text-center">
                <p className="text-xs font-bold text-red-700">
                  本当にすべての記録と登録動画を削除しますか？
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-2 rounded-xl bg-white border border-red-200 text-xs font-bold text-choco-700"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    削除する
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-choco-400 text-sm hover:text-choco-600 underline"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
