import React from 'react';
import { Database, FileJson, Info, ShieldCheck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AppInfoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-choco-500 p-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Info size={20} />
            <h2 className="font-bold text-lg">アプリについて</h2>
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
          {/* App Info */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-choco-800 mb-1">
              ちょこトレ
            </h3>
            <p className="text-xs text-choco-400 font-bold tracking-widest uppercase">
              ChocoTore
            </p>
            <div className="mt-4 text-sm text-choco-600">
              <p>毎日の「ちょこっと」した運動を、</p>
              <p>楽しく続けるアプリです。</p>
            </div>
          </div>

          <div className="border-t border-choco-100 my-4"></div>

          {/* Security & Data Policy */}
          <div className="bg-choco-50 p-5 rounded-2xl border border-choco-100 space-y-3">
            <h4 className="flex items-center font-bold text-choco-800">
              <ShieldCheck size={18} className="mr-2 text-green-600" />
              ログイン不要・個人情報ゼロ
            </h4>
            <p className="text-sm text-choco-700 leading-relaxed text-justify">
              本アプリはアカウント登録やログインが不要です。氏名・メールアドレスなどの
              <span className="font-bold text-choco-900">
                個人情報を一切取得・送信しません。
              </span>
              すべてお使いの端末内だけで完結します。
            </p>
          </div>

          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 space-y-4">
            <h4 className="flex items-center font-bold text-orange-800">
              <Database size={18} className="mr-2" />
              データの保存とJSON管理について
            </h4>
            <div className="space-y-3 text-sm text-choco-800">
              <p className="leading-relaxed text-justify">
                普段の記録はお使いのブラウザ（localStorage）に自動保存されます。さらに設定画面や完了画面から、いつでも
                <span className="font-bold">JSONファイルとして保存・読み込み</span>
                できます。
              </p>
              <ul className="list-disc list-outside pl-4 space-y-1 text-choco-700 text-xs">
                <li className="flex items-start gap-1">
                  <FileJson size={14} className="shrink-0 mt-0.5 text-orange-600" />
                  <span>
                    保存したJSONファイルを読み込めば、スマホ・PC間のデータ移行やバックアップ復元が簡単に行えます。
                  </span>
                </li>
                <li>
                  ブラウザの履歴やサイトデータを削除するとブラウザ内の記録は消えるため、定期的なJSON保存がおすすめです。
                </li>
                <li className="text-orange-700 font-bold">
                  ストリーク（継続日数）は、日本時間の朝 9:00 に日付が切り替わります。
                </li>
              </ul>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center pt-2">
            <p className="text-xs text-choco-400">Created by</p>
            <p className="font-bold text-choco-600">boxdate</p>
          </div>
        </div>
      </div>
    </div>
  );
};
