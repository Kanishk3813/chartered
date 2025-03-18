// src/components/video/FaceDetection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

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
    const loadModels = async () => {
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

  // Start face detection when video element and models are ready
  useEffect(() => {
    if (!isReady || !videoElement || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const displaySize = { 
      width: videoElement.videoWidth || videoElement.clientWidth, 
      height: videoElement.videoHeight || videoElement.clientHeight 
    };
    faceapi.matchDimensions(canvas, displaySize);
    
    // Setup interval for face detection
    detectionInterval.current = setInterval(async () => {
      if (videoElement.paused || videoElement.ended) return;
      
      try {
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
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
          
          // Draw success rectangle
          ctx.strokeStyle = '#22c55e'; // Green color
          ctx.lineWidth = 3;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          
          if (!faceDetected) {
            setFaceDetected(true);
            if (onFaceDetected) onFaceDetected(true);
          }
        } else {
          // Draw warning rectangle when no face detected
          ctx.strokeStyle = '#ef4444'; // Red color
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
    };
  }, [isReady, videoElement, onFaceDetected, faceDetected, drawLandmarks, highlightFace]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
    />
  );
}