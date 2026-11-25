import { describe, expect, it } from 'vitest';
import { getYoutubeId } from './youtube';

describe('getYoutubeId', () => {
  it('extracts IDs from watch, short, embed, and Shorts URLs', () => {
    expect(getYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
    expect(getYoutubeId('https://youtu.be/dQw4w9WgXcQ?t=10')).toBe(
      'dQw4w9WgXcQ'
    );
    expect(getYoutubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
    expect(getYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    );
  });

  it('returns null for invalid URLs', () => {
    expect(getYoutubeId('https://example.com/video')).toBeNull();
    expect(getYoutubeId('')).toBeNull();
  });
});
