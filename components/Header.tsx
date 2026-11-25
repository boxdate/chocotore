import React from 'react';
import { Info, Settings } from 'lucide-react';

interface Props {
  onOpenInfo: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<Props> = ({ onOpenInfo, onOpenSettings }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-choco-500 text-white p-4 shadow-md z-50 flex items-center justify-between px-6">
        <button 
          onClick={onOpenInfo}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Info size={24} />
        </button>

        <h1 className="text-xl font-bold tracking-wider">ちょこトレ</h1>
        
        <button 
          onClick={onOpenSettings}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Settings size={24} />
        </button>
    </header>
  );
};
