import React from 'react';
import { Info, Settings } from 'lucide-react';

interface Props {
  onOpenInfo: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<Props> = ({ onOpenInfo, onOpenSettings }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-choco-500 text-white shadow-md z-50 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onOpenInfo}
          aria-label="アプリについて"
          className="text-white/80 hover:text-white transition-colors"
        >
          <Info size={24} />
        </button>

        <h1 className="text-xl font-bold tracking-wider">ちょこトレ</h1>

        <button
          onClick={onOpenSettings}
          aria-label="設定・記録管理"
          className="text-white/80 hover:text-white transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};
