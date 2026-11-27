export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWA_INSTALL_BANNER_DISMISSED_KEY =
  'chocotore_pwa_install_dismissed';

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Detects iOS / iPadOS devices (including iPadOS desktop-class Safari).
 */
export const isIosDevice = (
  userAgent?: string,
  maxTouchPoints?: number
): boolean => {
  const ua =
    userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const touchPoints =
    maxTouchPoints ??
    (typeof navigator !== 'undefined' ? navigator.maxTouchPoints : 0);

  if (!ua) return false;
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  return ua.includes('Macintosh') && touchPoints > 1;
};

/**
 * Detects whether the app is currently running in installed standalone mode.
 */
export const isStandaloneMode = (
  win: Pick<Window, 'matchMedia' | 'navigator'> | undefined = typeof window !==
  'undefined'
    ? window
    : undefined
): boolean => {
  if (!win) return false;

  const displayModeStandalone =
    typeof win.matchMedia === 'function' &&
    win.matchMedia('(display-mode: standalone)').matches;

  const iosStandalone =
    (win.navigator as NavigatorWithStandalone | undefined)?.standalone === true;

  return Boolean(displayModeStandalone || iosStandalone);
};

export const getInstallBannerDismissed = (): boolean => {
  try {
    return localStorage.getItem(PWA_INSTALL_BANNER_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
};

export const setInstallBannerDismissed = (dismissed: boolean): void => {
  try {
    if (dismissed) {
      localStorage.setItem(PWA_INSTALL_BANNER_DISMISSED_KEY, '1');
    } else {
      localStorage.removeItem(PWA_INSTALL_BANNER_DISMISSED_KEY);
    }
  } catch {
    // Ignore storage access errors in restricted browsing contexts
  }
};
