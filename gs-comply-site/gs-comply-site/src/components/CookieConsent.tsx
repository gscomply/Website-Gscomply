import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const STORAGE_KEY = 'gscomply_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
    if (choice === 'accepted') {
      window.location.reload();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-950 border-t border-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {!showManage ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300 leading-relaxed">
                We use cookies to analyse traffic and improve your experience. See our{' '}
                <a href="/privacy-policy" className="text-[#4ade80] underline hover:text-[#22c55e]">Privacy Policy</a>{' '}
                for details.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowManage(true)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Manage
              </button>
              <button
                onClick={() => handleChoice('rejected')}
                className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleChoice('accepted')}
                className="px-5 py-2 text-sm font-semibold bg-[#1A6B3C] text-white rounded-md hover:bg-[#155a32] transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-sm text-gray-300 leading-relaxed flex-1">
              Accept analytics cookies to help us improve, or reject to only use essential cookies.
              You can change this anytime.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleChoice('rejected')}
                className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={() => handleChoice('accepted')}
                className="px-5 py-2 text-sm font-semibold bg-[#1A6B3C] text-white rounded-md hover:bg-[#155a32] transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => setShowManage(false)}
                className="p-2 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
