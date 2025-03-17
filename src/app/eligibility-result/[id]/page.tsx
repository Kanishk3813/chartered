'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LoanDetails {
  id: string;
  type: string;
  amount: number;
  interestRate: number;
  tenure: number;
  monthlyPayment: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  appliedDate: string;
  lastUpdated: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  rejectionReason?: string;
  nextSteps?: string[];
  documents: {
    aadhaar: boolean;
    pan: boolean;
    incomeProof: boolean;
    bankStatement: boolean;
  };
}

export default function EligibilityResultPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);

  useEffect(() => {
    // Mock data loading - in real app, fetch from API
    setTimeout(() => {
      // Generate different sample data based on the ID
      const loanStatus = id.includes('rejected') 
        ? 'rejected' 
        : id.includes('approved') 
          ? 'approved' 
          : id.includes('in_review') 
            ? 'in_review' 
            : 'pending';
            
      setLoanDetails({
        id: id,
        type: id.includes('personal') ? 'personal' : id.includes('home') ? 'home' : id.includes('education') ? 'education' : 'business',
        amount: id.includes('home') ? 3500000 : id.includes('education') ? 800000 : 250000,
        interestRate: id.includes('home') ? 8.5 : id.includes('education') ? 10.25 : 12.75,
        tenure: id.includes('home') ? 180 : id.includes('education') ? 60 : 36,
        monthlyPayment: id.includes('home') ? 34650 : id.includes('education') ? 17125 : 8375,
        status: loanStatus as any,
        appliedDate: id.includes('2025031701') ? '2025-03-12' : id.includes('2025022801') ? '2025-02-28' : '2025-01-05',
        lastUpdated: id.includes('2025031701') ? '2025-03-15' : id.includes('2025022801') ? '2025-03-10' : '2025-01-10',
        applicantName: 'Rahul Singh',
        applicantEmail: 'rahul.singh@example.com',
        applicantPhone: '+91 9876543210',
        rejectionReason: loanStatus === 'rejected' ? 'Insufficient income documentation and low credit score.' : undefined,
        nextSteps: loanStatus === 'in_review' 
          ? ['Complete video interview', 'Submit additional bank statements', 'Verify mobile number'] 
          : loanStatus === 'approved' 
            ? ['Complete e-signing of loan agreement', 'Set up automatic payments', 'Confirm disbursement details'] 
            : loanStatus === 'rejected' 
              ? ['Apply for a different loan product', 'Improve credit score', 'Contact support for assistance'] 
              : ['Submit required documents', 'Complete application form', 'Schedule verification call'],
        documents: {
          aadhaar: true,
          pan: true,
          incomeProof: loanStatus !== 'rejected',
          bankStatement: loanStatus === 'approved' || loanStatus === 'in_review'
        }
      });
      setLoading(false);
    }, 1500); // Simulate network delay
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Retrieving your loan application details...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!loanDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center max-w-lg bg-white p-8 rounded-lg shadow-md">
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find any loan application with the ID: {id}</p>
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  // Format currency to INR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge style
  const getStatusBadge = () => {
    switch (loanDetails.status) {
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✅ Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">❌ Rejected</span>;
      case 'in_review':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">🔄 Under Review</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">⏳ Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {getLoanTypeDisplay(loanDetails.type)} Application
                </h1>
                <p className="text-gray-600 mt-1">Application ID: {loanDetails.id}</p>
              </div>
              <div className="mt-4 md:mt-0">
                {getStatusBadge()}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Loan Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(loanDetails.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">{loanDetails.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenure:</span>
                    <span className="font-medium">{loanDetails.tenure} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium">{formatCurrency(loanDetails.monthlyPayment)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Application Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applied on:</span>
                    <span className="font-medium">{loanDetails.appliedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{loanDetails.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Documents:</span>
                    <span className="font-medium">
                      {Object.values(loanDetails.documents).filter(Boolean).length} of 4 submitted
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Applicant Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{loanDetails.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{loanDetails.applicantEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{loanDetails.applicantPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {loanDetails.status === 'rejected' && loanDetails.rejectionReason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Rejection Reason</h3>
                <p className="text-red-600">{loanDetails.rejectionReason}</p>
              </div>
            )}

            {loanDetails.nextSteps && loanDetails.nextSteps.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Next Steps</h3>
                <ul className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  {loanDetails.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start mb-2 last:mb-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Documents Submitted</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg border ${loanDetails.documents.aadhaar ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center">
                    {loanDetails.documents.aadhaar ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={loanDetails.documents.aadhaar ? 'text-green-700' : 'text-gray-500'}>Aadhaar Card</span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${loanDetails.documents.pan ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center">
                    {loanDetails.documents.pan ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={loanDetails.documents.pan ? 'text-green-700' : 'text-gray-500'}>PAN Card</span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${loanDetails.documents.incomeProof ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center">
                    {loanDetails.documents.incomeProof ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={loanDetails.documents.incomeProof ? 'text-green-700' : 'text-gray-500'}>Income Proof</span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${loanDetails.documents.bankStatement ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center">
                    {loanDetails.documents.bankStatement ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={loanDetails.documents.bankStatement ? 'text-green-700' : 'text-gray-500'}>Bank Statement</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4">
              {loanDetails.status === 'approved' && (
                <Link href={`/loan-agreement/${loanDetails.id}`} className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition w-full md:w-auto text-center flex-1 md:flex-none">
                  Complete Loan Agreement
                </Link>
              )}
              
              {loanDetails.status === 'pending' && (
                <Link href={`/loan-application/${loanDetails.type}/documents`} className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition w-full md:w-auto text-center flex-1 md:flex-none">
                  Continue Application
                </Link>
              )}
              
              {loanDetails.status === 'in_review' && (
                <Link href={`/loan-application/${loanDetails.type}/video-interview`} className="bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition w-full md:w-auto text-center flex-1 md:flex-none">
                  Complete Required Steps
                </Link>
              )}
              
              <Link href="/contact-support" className="bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition w-full md:w-auto text-center flex-1 md:flex-none">
                Contact Support
              </Link>
              
              <Link href="/dashboard" className="border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-100 transition w-full md:w-auto text-center flex-1 md:flex-none">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}