import { describe, expect, it } from 'vitest';
import { isIosDevice, isStandaloneMode } from './pwa';

describe('pwa utils', () => {
  describe('isIosDevice', () => {
    it('detects iPhone, iPad, and iPod user agents', () => {
      expect(
        isIosDevice(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
          5
        )
      ).toBe(true);
      expect(
        isIosDevice(
          'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
          5
        )
      ).toBe(true);
    });

    it('detects iPadOS desktop UA via touch points', () => {
      expect(
        isIosDevice(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
          5
        )
      ).toBe(true);
      expect(
        isIosDevice(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
          0
        )
      ).toBe(false);
    });

    it('returns false for Android and desktop Windows/Linux', () => {
      expect(
        isIosDevice(
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',
          5
        )
      ).toBe(false);
      expect(isIosDevice('', 0)).toBe(false);
    });
  });

  describe('isStandaloneMode', () => {
    it('returns true when display-mode is standalone', () => {
      const mockWindow = {
        matchMedia: (query: string) =>
          ({ matches: query === '(display-mode: standalone)' }) as MediaQueryList,
        navigator: {} as Navigator,
      };
      expect(isStandaloneMode(mockWindow)).toBe(true);
    });

    it('returns true when navigator.standalone is true on iOS', () => {
      const mockWindow = {
        matchMedia: () => ({ matches: false }) as MediaQueryList,
        navigator: { standalone: true } as unknown as Navigator,
      };
      expect(isStandaloneMode(mockWindow)).toBe(true);
    });

    it('returns false in normal browser mode', () => {
      const mockWindow = {
        matchMedia: () => ({ matches: false }) as MediaQueryList,
        navigator: { standalone: false } as unknown as Navigator,
      };
      expect(isStandaloneMode(mockWindow)).toBe(false);
      expect(isStandaloneMode(undefined)).toBe(false);
    });
  });
});
