import React from 'react';
import { Calendar, CheckSquare, Flame, Trophy } from 'lucide-react';
import { TrainingData } from '../types';

interface Props {
  data: TrainingData;
  highlight?: boolean;
}

export const StreakCounter: React.FC<Props> = ({ data, highlight = false }) => {
  return (
    <div
      className={`
      flex flex-col items-center justify-center p-5 rounded-3xl w-full shadow-sm border
      ${highlight ? 'bg-orange-50 border-orange-200' : 'bg-white border-choco-100'}
    `}
    >
      <div className="flex items-center space-x-2 mb-1">
        <span className="font-bold tracking-widest uppercase text-xs text-choco-400">
          Current Streak
        </span>
      </div>

      <div className="flex items-baseline justify-center space-x-1 mb-4">
        <Flame
          size={32}
          className={`${data.currentStreakDays > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`}
        />
        <span className="text-5xl font-black text-choco-800 leading-none">
          {data.currentStreakDays}
        </span>
        <span className="text-sm font-bold text-choco-500">Days</span>
      </div>

      <div className="grid grid-cols-3 w-full px-4 pt-3 border-t border-choco-100 text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-choco-400 uppercase tracking-wider mb-1">
            Best
          </span>
          <div className="flex items-center text-choco-700 font-bold text-sm">
            <Trophy size={12} className="mr-1" />
            {data.longestStreakDays}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-choco-400 uppercase tracking-wider mb-1">
            Total
          </span>
          <div className="flex items-center text-choco-700 font-bold text-sm">
            <CheckSquare size={12} className="mr-1" />
            {data.logs.length}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-choco-400 uppercase tracking-wider mb-1">
            Last
          </span>
          <div className="flex items-center text-choco-700 font-bold text-sm">
            <Calendar size={12} className="mr-1" />
            {data.lastCompletedDate
              ? data.lastCompletedDate.split('T')[0].slice(5)
              : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};
