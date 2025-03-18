// src/app/loan-application/[type]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoRecorder from '@/components/video/VideoRecorder';
import VideoPlayer from '@/components/video/VideoPlayer';

// Define loan type data mapping
const loanTypeData = {
  personal: {
    title: 'Personal Loan',
    introVideo: '/videos/personal-loan-intro.mp4',
    welcomeMessage: 'Welcome to your Personal Loan application. I\'ll guide you through the verification process.',
    questions: [
      'Please hold your ID card clearly in front of the camera for verification.',
      'Please state your full name and the purpose of this personal loan.',
      'Could you confirm your monthly income and existing financial commitments?'
    ]
  },
  home: {
    title: 'Home Loan',
    introVideo: '/videos/home-loan-intro.mp4',
    welcomeMessage: 'Welcome to your Home Loan application. Let\'s verify your details to proceed with your property purchase.',
    questions: [
      'Please hold your ID card clearly in front of the camera for verification.',
      'Please show the property documents or details of the property you wish to purchase.',
      'Could you confirm your employment status and duration at your current workplace?'
    ]
  },
  education: {
    title: 'Education Loan',
    introVideo: '/videos/education-loan-intro.mp4',
    welcomeMessage: 'Welcome to your Education Loan application. I\'ll help you secure funding for your educational journey.',
    questions: [
      'Please hold your ID card clearly in front of the camera for verification.',
      'Please show your admission letter or course details document.',
      'Could you share details about the institution and course duration?'
    ]
  },
  business: {
    title: 'Business Loan',
    introVideo: '/videos/business-loan-intro.mp4',
    welcomeMessage: 'Welcome to your Business Loan application. Let\'s get your business the funding it needs.',
    questions: [
      'Please hold your ID card clearly in front of the camera for verification.',
      'Please show your business registration documents or license.',
      'Could you share information about your business revenue and growth plans?'
    ]
  },
  vehicle: {
    title: 'Vehicle Loan',
    introVideo: '/videos/vehicle-loan-intro.mp4',
    welcomeMessage: 'Welcome to your Vehicle Loan application. I\'ll help you get on the road with your new vehicle.',
    questions: [
      'Please hold your ID card clearly in front of the camera for verification.',
      'Please show the vehicle quotation or details of the vehicle you wish to purchase.',
      'Could you confirm your driving license details?'
    ]
  }
};

export default function LoanVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const loanType = params.type as string;
  
  const [stage, setStage] = useState<'intro' | 'verification' | 'question' | 'processing' | 'complete'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [introCompleted, setIntroCompleted] = useState(false);
  
  // Fallback to personal loan if type is invalid
  const loanData = loanTypeData[loanType as keyof typeof loanTypeData] || loanTypeData.personal;
  
  // Handle intro video completion
  const handleIntroEnded = () => {
    setIntroCompleted(true);
    setStage('verification');
  };
  
  // Handle recording completion
  const handleRecordingComplete = (videoBlob: Blob) => {
    setRecordings([...recordings, videoBlob]);
    
    // Move to next question or complete
    if (currentQuestion < loanData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage('processing');
      
      // Simulate processing and completion
      setTimeout(() => {
        setStage('complete');
      }, 3000);
    }
  };
  
  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Handle go to next application step
  const handleContinueApplication = () => {
    router.push(`/loan-application/${loanType}/details`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-blue-600 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{loanData.title} Application</h1>
              <p className="text-blue-100 mt-2">
                AI-Assisted Verification Process
              </p>
            </div>
            
            <div className="p-6">
              {stage === 'intro' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">
                      {loanData.welcomeMessage}
                    </p>
                  </div>
                  
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {/* Fallback to a message if video doesn't exist */}
                    {loanData.introVideo ? (
                      <VideoPlayer 
                        videoSrc={loanData.introVideo} 
                        autoPlay={true} 
                        onEnded={handleIntroEnded}
                        title="AI Branch Manager Introduction"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white p-8 text-center">
                        <div>
                          <h3 className="text-xl font-bold mb-4">Welcome to your {loanData.title} Application</h3>
                          <p>Our AI branch manager will guide you through the verification process.</p>
                          <button 
                            onClick={handleIntroEnded}
                            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                          >
                            Continue to Verification
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {introCompleted && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setStage('verification')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                      >
                        Begin Verification
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {stage === 'verification' && (
                <VideoRecorder
                  onRecordingComplete={handleRecordingComplete}
                  maxDurationSeconds={60}
                  questionText={loanData.questions[currentQuestion]}
                  questionVideoSrc={`/videos/${loanType}-question-${currentQuestion + 1}.mp4`}
                />
              )}
              
              {stage === 'processing' && (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Verification</h3>
                  <p className="text-gray-600">Please wait while our AI system verifies your information...</p>
                </div>
              )}
              
              {stage === 'complete' && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Verification Complete!</h3>
                  <p className="text-gray-600 mb-6">Your identity and information have been successfully verified.</p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleReturnToDashboard}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                    >
                      Return to Dashboard
                    </button>
                    <button
                      onClick={handleContinueApplication}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                    >
                      Continue Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Process Steps</h2>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Watch the AI Branch Manager's introduction and guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>Complete the video verification by showing your ID and required documents</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Answer all verification questions via video recording</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>Wait for AI verification to complete</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">5</span>
                  <span>Continue with your loan application</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-blue-50 p-6 border-t border-blue-100">
              <div className="flex items-center text-sm text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>
                  Your privacy is important to us. All recorded videos are encrypted and will only be used for verification purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}