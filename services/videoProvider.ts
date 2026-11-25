import { TrainingVideo } from '../types';
import { getYoutubeId } from '../utils/youtube';
import { updateCustomVideo } from './storageService';

export const registerFavoriteVideo = async (
  url: string
): Promise<TrainingVideo> => {
  const videoId = getYoutubeId(url);
  if (!videoId) {
    throw new Error('有効なYouTube URLを入力してください');
  }

  let title = 'My Daily Workout';
  let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    const response = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    if (response.ok) {
      const data = (await response.json()) as {
        title?: string;
        thumbnail_url?: string;
      };
      if (data.title) title = data.title;
      if (data.thumbnail_url) thumbnailUrl = data.thumbnail_url;
    }
  } catch (error) {
    console.warn('Could not fetch video metadata, using defaults', error);
  }

  const newVideo: TrainingVideo = {
    videoId,
    youtubeUrl: url.trim(),
    title,
    targetMuscle: 'Custom Routine',
    thumbnailUrl,
  };

  updateCustomVideo(newVideo);
  return newVideo;
};
