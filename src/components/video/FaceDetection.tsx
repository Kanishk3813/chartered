'use client';

import { useState, useEffect, useRef } from 'react';

const [isReady, setIsReady] = useState(false);

useEffect(() => {
  const loadFaceAPI = async () => {
    const faceapi = await import('face-api.js');
    const MODEL_URL = '/models';

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsReady(true);
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face detection models:', error);
    }
  };

  loadFaceAPI();
}, []);


interface FaceDetectionProps {
  videoElement: HTMLVideoElement | null;
  onFaceDetected?: (detected: boolean) => void;
  drawLandmarks?: boolean;
  highlightFace?: boolean;
}

export default function FaceDetection({ 
  videoElement, 
  onFaceDetected,
  drawLandmarks = true,
  highlightFace = true
}: FaceDetectionProps) {
  const [isReady, setIsReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      console.log('Video loaded, starting face detection');
      setIsReady(true);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoElement]);

  useEffect(() => {
    const loadModels = async () => {
      const faceapi = await import('face-api.js'); // Ensure dynamic import for frontend
      const MODEL_URL = '/models';

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsReady(true);
        console.log('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };

    loadModels();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady || !videoElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      canvas.width = videoElement.videoWidth || videoElement.clientWidth;
      canvas.height = videoElement.videoHeight || videoElement.clientHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    detectionInterval.current = setInterval(async () => {
      if (videoElement.paused || videoElement.ended) return;

      try {
        const faceapi = await import('face-api.js');
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height,
        });

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (resizedDetections.length > 0) {
          if (highlightFace) {
            faceapi.draw.drawDetections(canvas, resizedDetections);
          }
          if (drawLandmarks) {
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          }

          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 3;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);

          if (!faceDetected) {
            setFaceDetected(true);
            if (onFaceDetected) onFaceDetected(true);
          }
        } else {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);

          if (faceDetected) {
            setFaceDetected(false);
            if (onFaceDetected) onFaceDetected(false);
          }
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 100);

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isReady, videoElement, onFaceDetected, faceDetected, drawLandmarks, highlightFace]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
  );
}
