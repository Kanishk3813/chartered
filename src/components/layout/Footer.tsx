import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">VidBanker</h3>
            <p className="text-blue-200">
              Making loan applications simple and interactive through video conversations.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link href="/loan-application/personal" className="text-blue-200 hover:text-white">Personal Loans</Link></li>
              <li><Link href="/loan-application/home" className="text-blue-200 hover:text-white">Home Loans</Link></li>
              <li><Link href="/loan-application/vehicle" className="text-blue-200 hover:text-white">Vehicle Loans</Link></li>
              <li><Link href="/loan-application/education" className="text-blue-200 hover:text-white">Education Loans</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-blue-200 hover:text-white">Help Center</Link></li>
              <li><Link href="/faq" className="text-blue-200 hover:text-white">FAQs</Link></li>
              <li><Link href="/privacy" className="text-blue-200 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-blue-200 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-blue-200">
              <li>support@vidbanker.com</li>
              <li>+91 1234567890</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300">
          <p>&copy; {new Date().getFullYear()} VidBanker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}