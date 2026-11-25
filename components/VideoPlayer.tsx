import React, { useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { TrainingVideo } from '../types';
import { getYoutubeId } from '../utils/youtube';

interface Props {
  video: TrainingVideo;
  onComplete: () => void;
}

export const VideoPlayer: React.FC<Props> = ({ video, onComplete }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const youtubeId = useMemo(
    () => getYoutubeId(video.youtubeUrl) ?? video.videoId,
    [video.youtubeUrl, video.videoId]
  );

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-choco-900/10 z-0">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <iframe
          className="w-full h-full relative z-10"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&playsinline=1`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsVideoLoaded(true)}
        ></iframe>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <h2 className="text-xl font-bold text-choco-900 mb-1">{video.title}</h2>
        <p className="text-choco-500 text-sm mb-6">{video.targetMuscle}</p>

        <button
          onClick={onComplete}
          className="group flex items-center space-x-3 bg-choco-500 hover:bg-choco-600 active:bg-choco-700 text-white px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="font-bold text-lg">完了！</span>
          <CheckCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
        <p className="text-xs text-choco-400 mt-3">
          動画が終わったらボタンを押してね
        </p>
      </div>
    </div>
  );
};
