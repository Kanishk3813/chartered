'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

// Interface for document state
interface DocumentState {
  aadhaar: File | null;
  pan: File | null;
  incomeProof: File | null;
  bankStatement: File | null;
}

// Interface for document preview URLs
interface DocumentPreviewUrls {
  aadhaar: string | null;
  pan: string | null;
  incomeProof: string | null;
  bankStatement: string | null;
}

export default function DocumentsPage() {
  const router = useRouter();
  const params = useParams();
  const loanType = params.type as string;
  
  // State for documents
  const [documents, setDocuments] = useState<DocumentState>({
    aadhaar: null,
    pan: null,
    incomeProof: null,
    bankStatement: null,
  });
  
  // State for document preview URLs
  const [previewUrls, setPreviewUrls] = useState<DocumentPreviewUrls>({
    aadhaar: null,
    pan: null,
    incomeProof: null,
    bankStatement: null,
  });
  
  // State for upload progress
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({
    aadhaar: 0,
    pan: 0,
    incomeProof: 0,
    bankStatement: 0,
  });
  
  // State for upload status
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'idle' | 'uploading' | 'success' | 'error'}>({
    aadhaar: 'idle',
    pan: 'idle',
    incomeProof: 'idle',
    bankStatement: 'idle',
  });
  
  // State for overall progress
  const [overallProgress, setOverallProgress] = useState(0);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(false);
  
  // State for error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to handle file changes
  const handleFileChange = (documentType: keyof DocumentState, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: file
    }));
    
    // Create a preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({
        ...prev,
        [documentType]: url
      }));
      
      // Simulate upload progress
      simulateUpload(documentType);
    } else {
      setPreviewUrls(prev => ({
        ...prev,
        [documentType]: null
      }));
      setUploadStatus(prev => ({
        ...prev,
        [documentType]: 'idle'
      }));
      setUploadProgress(prev => ({
        ...prev,
        [documentType]: 0
      }));
    }
    
    calculateOverallProgress();
  };
  
  // Function to simulate upload progress
  const simulateUpload = (documentType: string) => {
    setUploadStatus(prev => ({
      ...prev,
      [documentType]: 'uploading'
    }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadStatus(prev => ({
          ...prev,
          [documentType]: 'success'
        }));
      }
      
      setUploadProgress(prev => ({
        ...prev,
        [documentType]: Math.min(progress, 100)
      }));
      
      calculateOverallProgress();
    }, 500);
  };
  
  // Function to calculate overall progress
  const calculateOverallProgress = () => {
    setTimeout(() => {
      const totalDocuments = Object.keys(documents).length;
      const uploadedDocuments = Object.values(documents).filter(Boolean).length;
      setOverallProgress((uploadedDocuments / totalDocuments) * 100);
    }, 100);
  };
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    // Validate that required documents are uploaded
    const requiredDocuments = ['aadhaar', 'pan'];
    let allRequired = true;
    
    for (const doc of requiredDocuments) {
      if (!documents[doc as keyof DocumentState]) {
        allRequired = false;
        setErrorMessage(`Please upload all required documents. Aadhaar and PAN are mandatory.`);
        break;
      }
    }
    
    if (!allRequired) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call to submit documents
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate a random application ID
      const applicationId = `LOAN${loanType.charAt(0).toUpperCase()}${Math.floor(Math.random() * 1000000)}`;
      
      // Navigate to the review page
      router.push(`/loan-application/${loanType}/review?applicationId=${applicationId}`);
    }, 2000);
  };
  
  // Get loan type display name
  const getLoanTypeDisplay = (type: string): string => {
    switch (type) {
      case 'personal': return 'Personal Loan';
      case 'home': return 'Home Loan';
      case 'education': return 'Education Loan';
      case 'business': return 'Business Loan';
      default: return 'Loan';
    }
  };
  
  // Cleanup function for preview URLs
  useEffect(() => {
    return () => {
      // Revoke object URLs to avoid memory leaks
      Object.values(previewUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link href={`/loan-application/${loanType}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to {getLoanTypeDisplay(loanType)} Details
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Upload Documents</h1>
            <p className="text-gray-600 mt-1">Please upload the required documents for your {getLoanTypeDisplay(loanType)} application</p>
          </div>
          
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card Upload */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium text-gray-800">Aadhaar Card <span className="text-red-500">*</span></h3>
                    <p className="text-sm text-gray-500">Upload a clear copy of your Aadhaar card (front and back).</p>
                  </div>
                  <div className="p-4">
                    {previewUrls.aadhaar ? (
                      <div className="mb-4 relative">
                        <img src={previewUrls.aadhaar} alt="Aadhaar Preview" className="max-h-40 mx-auto border rounded" />
                        <button 
                          type="button"
                          onClick={() => handleFileChange('aadhaar', null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG or PDF (Max. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange('aadhaar', e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                    
                    {uploadStatus.aadhaar !== 'idle' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{uploadStatus.aadhaar === 'success' ? 'Upload complete' : 'Uploading...'}</span>
                          <span>{Math.round(uploadProgress.aadhaar)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${uploadStatus.aadhaar === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${uploadProgress.aadhaar}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* PAN Card Upload */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium text-gray-800">PAN Card <span className="text-red-500">*</span></h3>
                    <p className="text-sm text-gray-500">Upload a clear copy of your PAN card.</p>
                  </div>
                  <div className="p-4">
                    {previewUrls.pan ? (
                      <div className="mb-4 relative">
                        <img src={previewUrls.pan} alt="PAN Preview" className="max-h-40 mx-auto border rounded" />
                        <button 
                          type="button"
                          onClick={() => handleFileChange('pan', null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG or PDF (Max. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange('pan', e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                    
                    {uploadStatus.pan !== 'idle' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{uploadStatus.pan === 'success' ? 'Upload complete' : 'Uploading...'}</span>
                          <span>{Math.round(uploadProgress.pan)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${uploadStatus.pan === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${uploadProgress.pan}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Income Proof Upload */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium text-gray-800">Income Proof</h3>
                    <p className="text-sm text-gray-500">Upload your salary slips or Form 16 or any other income proof.</p>
                  </div>
                  <div className="p-4">
                    {previewUrls.incomeProof ? (
                      <div className="mb-4 relative">
                        <img src={previewUrls.incomeProof} alt="Income Proof Preview" className="max-h-40 mx-auto border rounded" />
                        <button 
                          type="button"
                          onClick={() => handleFileChange('incomeProof', null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG or PDF (Max. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange('incomeProof', e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                    
                    {uploadStatus.incomeProof !== 'idle' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{uploadStatus.incomeProof === 'success' ? 'Upload complete' : 'Uploading...'}</span>
                          <span>{Math.round(uploadProgress.incomeProof)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${uploadStatus.incomeProof === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${uploadProgress.incomeProof}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Bank Statement Upload */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-medium text-gray-800">Bank Statement</h3>
                    <p className="text-sm text-gray-500">Upload last 6 months bank statement.</p>
                  </div>
                  <div className="p-4">
                    {previewUrls.bankStatement ? (
                      <div className="mb-4 relative">
                        <img src={previewUrls.bankStatement} alt="Bank Statement Preview" className="max-h-40 mx-auto border rounded" />
                        <button 
                          type="button"
                          onClick={() => handleFileChange('bankStatement', null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG or PDF (Max. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange('bankStatement', e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                    
                    {uploadStatus.bankStatement !== 'idle' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{uploadStatus.bankStatement === 'success' ? 'Upload complete' : 'Uploading...'}</span>
                          <span>{Math.round(uploadProgress.bankStatement)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${uploadStatus.bankStatement === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${uploadProgress.bankStatement}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                <Link 
                  href={`/loan-application/${loanType}`}
                  className="py-2.5 px-5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-center"
                >
                  Back
                </Link>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="py-2.5 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Continue to Next Step'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Why we need these documents?</h3>
              <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                <li>Aadhaar Card: For KYC verification as per RBI guidelines</li>
                <li>PAN Card: For income tax verification</li>
                <li>Income Proof: To assess your repayment capacity</li>
                <li>Bank Statement: To verify your banking history and financial stability</li>
              </ul>
              <p className="mt-2 text-sm text-blue-700">
                All your documents are securely stored and encrypted. We do not share your personal information with any third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}