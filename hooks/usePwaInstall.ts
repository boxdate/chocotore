import { useCallback, useEffect, useState } from 'react';
import {
  BeforeInstallPromptEvent,
  getInstallBannerDismissed,
  isIosDevice,
  isStandaloneMode,
  setInstallBannerDismissed,
} from '../utils/pwa';

export type InstallPromptResult = 'accepted' | 'dismissed' | 'unavailable';

export interface PwaInstallState {
  isInstalled: boolean;
  canPromptInstall: boolean;
  isIos: boolean;
  isBannerDismissed: boolean;
  dismissBanner: () => void;
  promptInstall: () => Promise<InstallPromptResult>;
}

export const usePwaInstall = (): PwaInstallState => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() =>
    isStandaloneMode()
  );
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() =>
    getInstallBannerDismissed()
  );
  const [isIos] = useState<boolean>(() => isIosDevice());

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(display-mode: standalone)')
        : null;

    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };

    mediaQuery?.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery?.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallPromptResult> => {
    if (!deferredPrompt) return 'unavailable';

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    return outcome;
  }, [deferredPrompt]);

  const dismissBanner = useCallback(() => {
    setInstallBannerDismissed(true);
    setIsBannerDismissed(true);
  }, []);

  return {
    isInstalled,
    canPromptInstall: deferredPrompt !== null && !isInstalled,
    isIos,
    isBannerDismissed,
    dismissBanner,
    promptInstall,
  };
};
