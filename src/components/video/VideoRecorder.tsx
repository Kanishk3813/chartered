// src/components/video/VideoRecorder.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import FaceDetection from './FaceDetection';

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob) => void;
  maxDurationSeconds?: number;
  questionText: string;
  questionVideoSrc?: string;
}

export default function VideoRecorder({
  onRecordingComplete,
  maxDurationSeconds = 60,
  questionText,
  questionVideoSrc
}: VideoRecorderProps) {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [countdown, setCountdown] = useState(maxDurationSeconds);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isQuestionPlayed, setIsQuestionPlayed] = useState(false);

  // Request camera permission
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCameraPermission(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  // Handle face detection status
  const handleFaceDetected = useCallback((detected: boolean) => {
    setFaceDetected(detected);
  }, []);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (capturing && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && capturing) {
      handleStopCapture();
    }
    return () => clearInterval(interval);
  }, [capturing, countdown]);

  const handleStartCapture = useCallback(() => {
    if (!faceDetected) {
      alert("Please position your face in front of the camera");
      return;
    }

    setCapturing(true);
    setRecordedChunks([]);
    setCountdown(maxDurationSeconds);

    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4'
      });
      
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }
  }, [faceDetected, maxDurationSeconds]);

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => [...prev, data]);
      }
    },
    []
  );

  const handleStopCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, []);

  // Create video preview when recording stops
  useEffect(() => {
    if (recordedChunks.length > 0 && !capturing) {
      const blob = new Blob(recordedChunks, {
        type: recordedChunks[0].type
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setShowPreview(true);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [recordedChunks, capturing]);

  const handleSubmit = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: recordedChunks[0].type
      });
      onRecordingComplete(blob);
      setShowPreview(false);
    }
  }, [recordedChunks, onRecordingComplete]);

  const handleRetake = useCallback(() => {
    setRecordedChunks([]);
    setVideoUrl(null);
    setShowPreview(false);
    setCountdown(maxDurationSeconds);
  }, [maxDurationSeconds]);

  const handleQuestionVideoEnded = useCallback(() => {
    setIsQuestionPlayed(true);
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  if (cameraPermission === false) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h3 className="text-xl font-semibold text-red-700 mb-2">Camera Access Required</h3>
        <p className="text-red-600 mb-4">
          Please allow camera access to record your video response. You may need to update your browser settings.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Record Your Response</h2>
      
      {questionVideoSrc && !isQuestionPlayed ? (
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-blue-800 font-medium">
              Please watch the AI Branch Manager's question before recording your response.
            </p>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              src={questionVideoSrc} 
              controls 
              autoPlay 
              className="w-full h-full"
              onEnded={handleQuestionVideoEnded}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Question:</h3>
            <p className="text-blue-800">{questionText}</p>
          </div>
          
          {showPreview ? (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Your Recorded Response:</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {videoUrl && (
                  <video src={videoUrl} controls className="w-full h-full" />
                )}
              </div>
              
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleRetake}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  Record Again
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Submit Response
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <Webcam
                  audio={true}
                  ref={webcamRef}
                  videoConstraints={videoConstraints}
                  className="w-full h-full"
                  mirrored
                />
                
                {webcamRef.current && webcamRef.current.video && (
                  <FaceDetection 
                    videoElement={webcamRef.current.video}
                    onFaceDetected={handleFaceDetected}
                    drawLandmarks={true}
                    highlightFace={true}
                  />
                )}
                
                {/* Face detection indicator */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full text-white text-sm">
                  {faceDetected ? (
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Face Detected
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      No Face Detected
                    </span>
                  )}
                </div>
                
                {/* Recording indicator */}
                {capturing && (
                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full text-white text-sm flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Recording: {countdown}s
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-center">
                {capturing ? (
                  <button
                    onClick={handleStopCapture}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
                  >
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStartCapture}
                    disabled={!faceDetected || (!isQuestionPlayed && !!questionVideoSrc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {!faceDetected ? 'Face Not Detected' : !isQuestionPlayed && questionVideoSrc ? 'Watch Question First' : 'Start Recording'}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-medium text-gray-700 mb-2">Tips for a Good Recording:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Ensure you're in a well-lit environment with your face clearly visible</li>
          <li>Speak clearly and at a normal pace</li>
          <li>Look directly at the camera</li>
          <li>Minimize background noise and distractions</li>
          <li>Keep your response concise and to the point</li>
        </ul>
      </div>
    </div>
  );
}