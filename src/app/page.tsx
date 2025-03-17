// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Meet Your Virtual Branch Manager
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Apply for loans through interactive video conversations. No forms, no waiting in lines.
              Just you and your AI Branch Manager working together to find the perfect loan solution.&apos;
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/loan-application" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300"
              >
                Apply for a Loan
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300"
              >
                Check Application Status
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/virtual-manager.jpg" 
                alt="Virtual Branch Manager" 
                width={600} 
                height={400} 
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Video Conversation</h3>
              <p className="text-gray-600">
                Speak with our AI Branch Manager through video. Answer questions about your needs and requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Upload</h3>
              <p className="text-gray-600">
                Easily upload your documents through your camera. We'll extract the needed information automatically.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-blue-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Decision</h3>
              <p className="text-gray-600">
                Get immediate feedback on your eligibility and loan offers tailored to your profile.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}