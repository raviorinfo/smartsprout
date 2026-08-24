"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-sprout-200 shadow-2xl rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
            <Cookie className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-gray-800">We Value Your Privacy</h3>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              We use cookies to enhance your browsing experience, serve non-personalized ads, and analyze our traffic. By clicking "Accept", you consent to our use of cookies in accordance with our Privacy Policy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-2 bg-sprout-500 hover:bg-sprout-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
