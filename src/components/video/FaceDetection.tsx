// src/components/video/FaceDetection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

interface FaceDetectionProps {
  videoElement: HTMLVideoElement | null;
  onFaceDetected?: (detected: boolean) => void;
}

export default function FaceDetection({ videoElement, onFaceDetected }: FaceDetectionProps) {
  const [isReady, setIsReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsReady(true);
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

  // Start face detection when video element and models are ready
  useEffect(() => {
    if (!isReady || !videoElement || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const displaySize = { width: videoElement.width, height: videoElement.height };
    faceapi.matchDimensions(canvas, displaySize);
    
    // Setup interval for face detection
    detectionInterval.current = setInterval(async () => {
      if (videoElement.paused || videoElement.ended) return;
      
      const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      
      if (resizedDetections.length > 0) {
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        if (!faceDetected) {
          setFaceDetected(true);
          if (onFaceDetected) onFaceDetected(true);
        }
      } else {
        if (faceDetected) {
          setFaceDetected(false);
          if (onFaceDetected) onFaceDetected(false);
        }
      }
    }, 100);
    
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [isReady, videoElement, onFaceDetected, faceDetected]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
  );
}