'use client'

import { useState } from "react";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-sm hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="text-sm hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
            <p className="text-sm text-gray-700 mb-4">
              This is your privacy policy content. You can replace this with real content explaining how you handle user data, cookies, etc.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
              aria-label="Close Privacy Policy"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Terms of Service</h2>
            <p className="text-sm text-gray-700 mb-4">
              These are your terms of service. Replace this with the details of how users may use your service, restrictions, liabilities, etc.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
              aria-label="Close Terms of Service"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
