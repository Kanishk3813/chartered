'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

type LoanType = 'personal' | 'home' | 'education' | 'business' | 'vehicle';

interface LoanOption {
  type: LoanType;
  title: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: string;
  imageSrc: string;
  commonUses: string[];
}

export default function LoanApplicationPage() {
  const router = useRouter();
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);

  const loanOptions: LoanOption[] = [
    {
      type: 'personal',
      title: 'Personal Loan',
      description: 'Quick funding for your personal needs with minimal documentation',
      minAmount: 50000,
      maxAmount: 1500000,
      interestRate: '10.50% - 18.00%',
      imageSrc: '/images/loans/personal-loan.jpg',
      commonUses: ['Medical expenses', 'Wedding expenses', 'Home renovation', 'Travel', 'Education']
    },
    {
      type: 'home',
      title: 'Home Loan',
      description: 'Fulfill your dream of owning a home with our affordable home loans',
      minAmount: 500000,
      maxAmount: 10000000,
      interestRate: '8.25% - 9.75%',
      imageSrc: '/images/loans/home-loan.jpg',
      commonUses: ['Purchase new property', 'Construction', 'Renovation', 'Land purchase', 'Balance transfer']
    },
    {
      type: 'education',
      title: 'Education Loan',
      description: 'Invest in your future with our education loans for studies in India and abroad',
      minAmount: 100000,
      maxAmount: 5000000,
      interestRate: '9.00% - 12.50%',
      imageSrc: '/images/loans/education-loan.jpg',
      commonUses: ['Tuition fees', 'Accommodation', 'Books & equipment', 'Travel expenses', 'Examination fees']
    },
    {
      type: 'business',
      title: 'Business Loan',
      description: 'Grow your business with flexible funding options and competitive rates',
      minAmount: 200000,
      maxAmount: 7500000,
      interestRate: '12.00% - 16.00%',
      imageSrc: '/images/loans/business-loan.jpg',
      commonUses: ['Working capital', 'Equipment purchase', 'Expansion', 'Inventory management', 'Marketing']
    },
    {
      type: 'vehicle',
      title: 'Vehicle Loan',
      description: 'Drive home your dream car with hassle-free vehicle financing',
      minAmount: 100000,
      maxAmount: 2500000,
      interestRate: '9.50% - 12.00%',
      imageSrc: '/images/loans/vehicle-loan.jpg',
      commonUses: ['New car purchase', 'Used vehicle', 'Two-wheeler', 'Commercial vehicle', 'Electric vehicle']
    }
  ];

  const handleContinue = () => {
    if (selectedLoan) {
      router.push(`/loan-application/${selectedLoan}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-blue-600 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Apply for a Loan</h1>
              <p className="text-blue-100 mt-2">
                Select the type of loan that best suits your needs
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {loanOptions.map((loan) => (
                  <div 
                    key={loan.type}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedLoan === loan.type 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedLoan(loan.type)}
                  >
                    <div className="bg-blue-100 rounded-lg h-32 mb-4 overflow-hidden relative">
                      {/* Replace with actual image or fallback to a placeholder */}
                      <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                        <span className="text-blue-800 font-medium">{loan.title}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{loan.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{loan.description}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-medium">₹{loan.minAmount.toLocaleString('en-IN')} - ₹{loan.maxAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Interest Rate</span>
                        <span className="font-medium">{loan.interestRate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedLoan && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Common uses for {loanOptions.find(l => l.type === selectedLoan)?.title}
                  </h3>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    {loanOptions.find(l => l.type === selectedLoan)?.commonUses.map((use, index) => (
                      <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Link 
                  href="/dashboard" 
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Dashboard
                </Link>
                <button
                  className={`px-6 py-2 rounded-lg font-medium ${
                    selectedLoan 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedLoan}
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  <strong>Eligibility:</strong> Loan approval is subject to the applicant's credit history, 
                  repayment capacity, and documentation verification.
                </p>
                <p>
                  <strong>Processing Time:</strong> Application processing typically takes 2-3 business days 
                  after all required documents are submitted.
                </p>
                <p>
                  <strong>Documentation:</strong> You will need to provide identification proof, address proof, 
                  income proof, and other documents depending on the loan type.
                </p>
                <p>
                  <strong>Disbursement:</strong> Approved loan amounts will be transferred to your registered 
                  bank account within 24 hours of final approval.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 border-t border-blue-100">
              <div className="flex items-center text-sm text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>
                  Need assistance? Contact our support team at <span className="font-medium">support@aibankmanager.com</span> or call <span className="font-medium">1800-123-4567</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}