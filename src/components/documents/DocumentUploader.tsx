// src/components/documents/DocumentUploader.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Tesseract from 'tesseract.js';

type DocumentType = 'AADHAAR' | 'PAN' | 'INCOME_PROOF' | 'BANK_STATEMENT' | 'PHOTO_ID' | 'ADDRESS_PROOF';

interface DocumentUploaderProps {
  documentType: DocumentType;
  onUploadComplete: (fileData: {
    file: File;
    preview: string;
    extractedData: any;
  }) => void;
  instructions?: string;
}

export default function DocumentUploader({ 
  documentType, 
  onUploadComplete,
  instructions 
}: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const documentTypeLabels: Record<DocumentType, string> = {
    AADHAAR: 'Aadhaar Card',
    PAN: 'PAN Card',
    INCOME_PROOF: 'Income Proof',
    BANK_STATEMENT: 'Bank Statement',
    PHOTO_ID: 'Photo ID',
    ADDRESS_PROOF: 'Address Proof'
  };

  const documentTypeInstructions: Record<DocumentType, string> = {
    AADHAAR: 'Please upload a clear photo of your Aadhaar card. Ensure all text is readable.',
    PAN: 'Please upload a clear photo of your PAN card. Ensure the PAN number is clearly visible.',
    INCOME_PROOF: 'Please upload your recent salary slip or income tax returns as proof of income.',
    BANK_STATEMENT: 'Please upload your last 3 months bank statement showing regular income.',
    PHOTO_ID: 'Please upload a government-issued photo ID (Driving License, Voter ID, etc.).',
    ADDRESS_PROOF: 'Please upload a recent utility bill or any other document as address proof.'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleFileSelected(selectedFile);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreview(event.target.result as string);
        processDocument(event.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions or try uploading a file instead.");
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File from the Blob
          const capturedFile = new File([blob], `${documentType.toLowerCase()}.jpg`, { 
            type: 'image/jpeg' 
          });
          
          // Stop camera stream
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          setCameraActive(false);
          
          // Process the captured image
          handleFileSelected(capturedFile);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const processDocument = async (imageDataUrl: string) => {
    setLoading(true);
    setProgress(0);
    
    try {
      // Extract text from the document using Tesseract OCR
      const result = await Tesseract.recognize(
        imageDataUrl,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.floor(m.progress * 100));
            }
          }
        }
      );
      
      // Extract data based on document type
      let data = {};
      const text = result.data.text;
      
      switch (documentType) {
        case 'AADHAAR':
          data = extractAadhaarData(text);
          break;
        case 'PAN':
          data = extractPanData(text);
          break;
        case 'INCOME_PROOF':
          data = extractIncomeData(text);
          break;
        default:
          data = { rawText: text };
      }
      
      setExtractedData(data);
      
      if (file && preview) {
        onUploadComplete({
          file,
          preview,
          extractedData: data
        });
      }
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error processing document. Please try again with a clearer image.');
    } finally {
      setLoading(false);
    }
  };

  const extractAadhaarData = (text: string) => {
    // Simple regex patterns for Aadhaar extraction
    const aadhaarPattern = /\b[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}\b/;
    const namePattern = /(?:Name|नाम)\s*:\s*([A-Za-z\s]+)/i;
    const dobPattern = /(?:DOB|Date of Birth|जन्म तिथि)\s*:\s*([0-9\/\-\.]+)/i;
    const genderPattern = /(?:MALE|FEMALE|पुरुष|महिला|Male|Female)/i;
    
    const aadhaarMatch = text.match(aadhaarPattern);
    const nameMatch = text.match(namePattern);
    const dobMatch = text.match(dobPattern);
    const genderMatch = text.match(genderPattern);
    
    return {
      documentType: 'AADHAAR',
      aadhaarNumber: aadhaarMatch ? aadhaarMatch[0] : null,
      name: nameMatch ? nameMatch[1].trim() : null,
      dob: dobMatch ? dobMatch[1] : null,
      gender: genderMatch ? genderMatch[0] : null,
      rawText: text
    };
  };

  const extractPanData = (text: string) => {
    // Simple regex patterns for PAN extraction
    const panPattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const namePattern = /(?:Name|नाम)\s*:?\s*([A-Za-z\s]+)/i;
    const dobPattern = /(?:DOB|Date of Birth|जन्म तिथि)\s*:?\s*([0-9\/\-\.]+)/i;
    
    const panMatch = text.match(panPattern);
    const nameMatch = text.match(namePattern);
    const dobMatch = text.match(dobPattern);
    
    return {
      documentType: 'PAN',
      panNumber: panMatch ? panMatch[0] : null,
      name: nameMatch ? nameMatch[1].trim() : null,
      dob: dobMatch ? dobMatch[1] : null,
      rawText: text
    };
  };

  const extractIncomeData = (text: string) => {
    // Simple regex patterns for income extraction
    const salaryPattern = /(?:Salary|Net Pay|Total|Amount)[:\s]*(?:Rs\.?|INR)?\s*([0-9,.]+)/i;
    const periodPattern = /(?:Period|Month|Date)[:\s]*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]*[0-9]{4})/i;
    
    const salaryMatch = text.match(salaryPattern);
    const periodMatch = text.match(periodPattern);
    
    return {
      documentType: 'INCOME_PROOF',
      income: salaryMatch ? salaryMatch[1].replace(/[,\s]/g, '') : null,
      period: periodMatch ? periodMatch[1] : null,
      rawText: text
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-2">
        {documentTypeLabels[documentType]}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {instructions || documentTypeInstructions[documentType]}
      </p>
      
      {/* Document preview */}
      {preview && !loading && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Document Preview:</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image 
              src={preview} 
              alt={`${documentTypeLabels[documentType]} Preview`}
              width={500}
              height={300}
              className="w-full object-contain max-h-64"
            />
          </div>
          
          {/* Extracted data display */}
          {extractedData && (
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Extracted Information:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(extractedData)
                  .filter(([key]) => key !== 'rawText' && key !== 'documentType')
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">
                        {value ? String(value) : 'Not found'}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-blue-800">
            Processing document... {progress}%
          </p>
        </div>
      )}
      
      {/* Camera/File selection options */}
      {!cameraActive && !preview && (
        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={activateCamera}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Take Photo
          </button>
          
          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
            Upload From Device
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
      
      {/* Camera interface */}
      {cameraActive && (
        <div className="flex flex-col items-center">
          <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden mb-4">
          <video 
              ref={videoRef}
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={captureImage}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Capture
            </button>
            
            <button
              type="button"
              onClick={stopCamera}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Re-upload / try again option */}
      {preview && !loading && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreview(null);
              setExtractedData(null);
            }}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Try Again
          </button>
        </div>
      )}
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}