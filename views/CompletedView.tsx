import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  PlayCircle,
  RotateCcw,
} from 'lucide-react';
import { TrainingData } from '../types';

interface Props {
  trainingData: TrainingData;
  trainerMessage: string;
  onBackHome: () => void;
  onExportJson: () => string;
}

export const CompletedView: React.FC<Props> = ({
  trainingData,
  trainerMessage,
  onBackHome,
  onExportJson,
}) => {
  const [savedFilename, setSavedFilename] = useState<string | null>(null);

  const handleSaveJson = () => {
    const filename = onExportJson();
    setSavedFilename(filename);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 py-6">
      <div className="mb-6 relative">
        <Award size={80} className="text-yellow-500 animate-bounce" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-choco-100 w-full mb-8 relative">
        <div className="absolute -top-3 -left-3 bg-choco-500 text-white p-2 rounded-full">
          <PlayCircle size={20} className="fill-current" />
        </div>
        <h3 className="font-bold text-choco-800 text-lg mb-2">
          Chocoトレーナー
        </h3>
        <p className="text-choco-600 leading-relaxed font-medium">
          {trainerMessage || 'お疲れ様でした！'}
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-8 bg-orange-100 text-orange-800 px-6 py-3 rounded-full font-bold">
        <span>🔥 Streak:</span>
        <span className="text-2xl">{trainingData.currentStreakDays}</span>
      </div>

      <div className="flex flex-col items-center space-y-3 w-full">
        <button
          onClick={onBackHome}
          className="flex items-center justify-center space-x-2 bg-choco-600 hover:bg-choco-700 text-white font-bold px-8 py-4 rounded-full transition-all shadow-md transform hover:scale-105 active:scale-95"
        >
          <RotateCcw size={20} />
          <span>ホームへ戻る</span>
        </button>

        <button
          onClick={handleSaveJson}
          className="flex items-center justify-center space-x-2 bg-white border border-choco-200 hover:bg-choco-50 text-choco-700 font-bold text-sm px-6 py-3 rounded-full transition-all shadow-sm active:scale-95"
        >
          {savedFilename ? (
            <>
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-green-700">JSONを保存しました</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>記録をJSONファイルに保存</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
