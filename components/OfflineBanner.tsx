import React from 'react';
import { WifiOff } from 'lucide-react';

interface Props {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<Props> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-orange-50 border border-orange-200 text-orange-900 rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 shadow-sm"
    >
      <WifiOff size={18} className="text-orange-600 shrink-0 mt-0.5" />
      <div className="text-xs leading-relaxed">
        <p className="font-bold text-orange-800">現在オフラインです</p>
        <p className="text-orange-700 mt-0.5">
          これまでの記録の確認やJSON保存・復元は利用できます。YouTube動画の登録や再生にはインターネット接続が必要です。
        </p>
      </div>
    </div>
  );
};
