/**
 * Extracts the 11-character YouTube video ID from standard, short, embed, or Shorts URLs.
 */
export const getYoutubeId = (url: string): string | null => {
  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11}).*/;
  const match = url.trim().match(regExp);
  return match ? match[1] : null;
};
