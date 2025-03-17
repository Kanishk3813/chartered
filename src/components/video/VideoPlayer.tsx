// src/components/video/VideoPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  title?: string;
  caption?: string;
}

export default function VideoPlayer({ 
  videoSrc, 
  autoPlay = false, 
  onEnded, 
  title,
  caption 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error autoplay:", err);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
      const percentClicked = clickPosition / progressBar.offsetWidth;
      videoRef.current.currentTime = percentClicked * videoRef.current.duration;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {title && (
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
      )}
      
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-black">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && (
            <button
            onClick={togglePlay}
            className="w-16 h-16 bg-blue-600 bg-opacity-90 rounded-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
        <div 
          className="h-1 bg-gray-600 rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-blue-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <button 
            onClick={togglePlay}
            className="text-white focus:outline-none"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
            )}
          </button>
          {caption && (
            <div className="text-white text-sm">{caption}</div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
              