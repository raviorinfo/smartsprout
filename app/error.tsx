"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-sprout-50 to-white px-4">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-orange-500/30 mb-8">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 mb-4">
          Oops! Something Went Wrong 😅
        </h2>
        <p className="text-lg text-gray-500 font-body mb-8 leading-relaxed">
          Don&apos;t worry! Even the best sprouts stumble sometimes.
          Let&apos;s try again or head back to the garden.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sprout-400 to-sprout-500 hover:from-sprout-300 hover:to-sprout-400 text-white font-heading font-bold rounded-2xl shadow-lg shadow-sprout-500/30 hover:shadow-sprout-400/40 hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-sprout-200 hover:border-sprout-400 text-sprout-700 font-heading font-bold rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
