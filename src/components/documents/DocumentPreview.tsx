// src/components/documents/DocumentPreview.tsx
'use client';

import React from 'react';
import Image from 'next/image';

type DocumentType = 'AADHAAR' | 'PAN' | 'INCOME_PROOF' | 'BANK_STATEMENT' | 'PHOTO_ID' | 'ADDRESS_PROOF';

interface DocumentPreviewProps {
  documentType: DocumentType;
  preview: string;
  extractedData: any;
  onEdit?: () => void;
  onConfirm?: () => void;
  editable?: boolean;
}

export default function DocumentPreview({
  documentType,
  preview,
  extractedData,
  onEdit,
  onConfirm,
  editable = true
}: DocumentPreviewProps) {
  const documentTypeLabels: Record<DocumentType, string> = {
    AADHAAR: 'Aadhaar Card',
    PAN: 'PAN Card',
    INCOME_PROOF: 'Income Proof',
    BANK_STATEMENT: 'Bank Statement',
    PHOTO_ID: 'Photo ID',
    ADDRESS_PROOF: 'Address Proof'
  };

  const renderDocumentDetails = () => {
    switch (documentType) {
      case 'AADHAAR':
        return (
          <>
            <DetailItem label="Name" value={extractedData.name} />
            <DetailItem label="Aadhaar Number" value={extractedData.aadhaarNumber} sensitive />
            <DetailItem label="Date of Birth" value={extractedData.dob} />
            <DetailItem label="Gender" value={extractedData.gender} />
          </>
        );
      case 'PAN':
        return (
          <>
            <DetailItem label="Name" value={extractedData.name} />
            <DetailItem label="PAN Number" value={extractedData.panNumber} sensitive />
            <DetailItem label="Date of Birth" value={extractedData.dob} />
          </>
        );
      case 'INCOME_PROOF':
        return (
          <>
            <DetailItem label="Income Amount" value={extractedData.income ? `₹${Number(extractedData.income).toLocaleString('en-IN')}` : 'Not found'} />
            <DetailItem label="Period" value={extractedData.period} />
          </>
        );
      default:
        return (
          <div className="text-gray-600 italic">
            Basic document information extracted. Please verify the details.
          </div>
        );
    }
  };

  // Component to display individual detail items
  const DetailItem = ({ 
    label, 
    value, 
    sensitive = false 
  }: { 
    label: string, 
    value: string | null, 
    sensitive?: boolean 
  }) => {
    const displayValue = value || 'Not found';
    
    // Mask sensitive information for display
    const maskedValue = sensitive && value 
      ? value.replace(/\w/g, (char, index) => {
          // Show first and last few characters, mask the rest
          return (index < 2 || index >= value.length - 2) ? char : '*';
        })
      : displayValue;
    
    return (
      <div className="flex flex-col py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-medium text-gray-900">{maskedValue}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-900">
            {documentTypeLabels[documentType]}
          </h3>
          {editable && onEdit && (
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Document Image */}
          <div className="w-full md:w-1/2">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Image 
                src={preview} 
                alt={`${documentTypeLabels[documentType]} Preview`}
                width={500}
                height={300}
                className="w-full object-contain max-h-64"
              />
            </div>
          </div>
          
          {/* Document Details */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 p-4 rounded-lg space-y-1">
              <h4 className="text-base font-medium text-gray-700 mb-3">Document Information</h4>
              {renderDocumentDetails()}
            </div>
            
            {onConfirm && (
              <div className="mt-6">
                <button
                  onClick={onConfirm}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Confirm & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 px-6 py-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-blue-800">
            Please verify that all information is correct before proceeding.
          </span>
        </div>
      </div>
    </div>
  );
}