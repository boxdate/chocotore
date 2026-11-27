import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  PlusSquare,
  Share,
  Smartphone,
  X,
} from 'lucide-react';
import { PwaInstallState } from '../hooks/usePwaInstall';

interface Props {
  pwaInstall: PwaInstallState;
  variant: 'banner' | 'settings';
}

export const PwaInstallGuide: React.FC<Props> = ({ pwaInstall, variant }) => {
  const {
    isInstalled,
    canPromptInstall,
    isIos,
    isBannerDismissed,
    dismissBanner,
    promptInstall,
  } = pwaInstall;

  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  const handleInstallClick = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      setInstallFeedback('インストールを受け付けました！');
    } else if (result === 'dismissed') {
      setInstallFeedback(
        'インストールはキャンセルされました。設定画面からいつでも再試行できます。'
      );
    }
  };

  if (variant === 'banner') {
    if (isInstalled || isBannerDismissed || (!canPromptInstall && !isIos)) {
      return null;
    }

    return (
      <div className="w-full bg-white/90 p-4 rounded-2xl border border-choco-200 shadow-sm relative text-left">
        <button
          onClick={dismissBanner}
          aria-label="インストール案内を閉じる"
          className="absolute top-2.5 right-2.5 p-1 text-choco-400 hover:text-choco-600 rounded-full hover:bg-choco-50 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="bg-choco-100 text-choco-600 p-2.5 rounded-xl shrink-0">
            <Smartphone size={20} />
          </div>
          <div className="space-y-2 flex-1">
            <div>
              <p className="font-bold text-sm text-choco-800">
                ホーム画面に追加してアプリとして使う
              </p>
              <p className="text-xs text-choco-500 mt-0.5">
                アイコンからすぐ開けて、オフライン時も記録を確認できます。
              </p>
            </div>

            {canPromptInstall ? (
              <button
                onClick={handleInstallClick}
                className="w-full bg-choco-600 hover:bg-choco-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Download size={14} />
                <span>アプリをインストール</span>
              </button>
            ) : (
              <ol className="text-xs text-choco-700 bg-choco-50 border border-choco-100 rounded-xl p-2.5 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <span className="font-bold text-choco-600">1.</span>
                  <span>Safari の</span>
                  <Share size={14} className="inline text-choco-600 shrink-0" />
                  <span className="font-bold">共有ボタン</span>
                  <span>をタップ</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-bold text-choco-600">2.</span>
                  <PlusSquare
                    size={14}
                    className="inline text-choco-600 shrink-0"
                  />
                  <span className="font-bold">「ホーム画面に追加」</span>
                  <span>を選択</span>
                </li>
              </ol>
            )}

            {installFeedback && (
              <p className="text-xs text-choco-600 font-medium">
                {installFeedback}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="flex items-center font-bold text-choco-800 mb-2">
        <Smartphone size={18} className="mr-2 text-choco-500" />
        アプリをインストール（PWA）
      </h3>
      <div className="bg-choco-50 p-5 rounded-2xl border border-choco-100 space-y-3">
        {isInstalled ? (
          <div className="flex items-center gap-2 text-sm font-bold text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>アプリとして起動中です（インストール済み）</span>
          </div>
        ) : (
          <>
            <p className="text-sm text-choco-700 leading-relaxed">
              ホーム画面やデスクトップに追加すると、ブラウザの枠なしで素早く起動でき、オフライン時でも記録の確認やJSON管理が使えます。
            </p>

            {canPromptInstall && (
              <button
                onClick={handleInstallClick}
                className="w-full bg-choco-600 hover:bg-choco-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Download size={16} />
                <span>アプリをインストール</span>
              </button>
            )}

            {isIos && (
              <div className="bg-white p-3.5 rounded-xl border border-choco-100 space-y-2 text-xs text-choco-700">
                <p className="font-bold text-choco-800">
                  iPhone / iPad（Safari）での追加手順
                </p>
                <ol className="space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <span className="font-bold text-choco-600">1.</span>
                    <span>画面の</span>
                    <Share
                      size={14}
                      className="inline text-choco-600 shrink-0"
                    />
                    <span className="font-bold">共有ボタン</span>
                    <span>をタップ</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="font-bold text-choco-600">2.</span>
                    <PlusSquare
                      size={14}
                      className="inline text-choco-600 shrink-0"
                    />
                    <span className="font-bold">「ホーム画面に追加」</span>
                    <span>をタップして「追加」</span>
                  </li>
                </ol>
              </div>
            )}

            {!canPromptInstall && !isIos && (
              <div className="bg-white p-3.5 rounded-xl border border-choco-100 space-y-1.5 text-xs text-choco-600">
                <p className="font-bold text-choco-800">インストール方法</p>
                <p className="leading-relaxed">
                  Chrome / Edge ではアドレスバー右側のインストールアイコン、またはブラウザメニューの「ホーム画面に追加」「アプリをインストール」から追加できます。
                </p>
              </div>
            )}

            {installFeedback && (
              <p className="text-xs font-bold text-choco-700">
                {installFeedback}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
