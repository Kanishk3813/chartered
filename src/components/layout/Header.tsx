import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.svg" 
              alt="VidBanker Logo" 
              width={40} 
              height={40} 
              className="mr-2"
            />
            <span className="text-xl font-bold text-blue-900">VidBanker</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/loan-application" className="text-gray-700 hover:text-blue-600">
              Apply for Loan
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </nav>
          
          <div className="flex items-center">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}