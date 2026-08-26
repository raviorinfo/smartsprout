import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 mb-4">
        <AlertTriangle className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-500 font-body mb-6 max-w-sm">
        {message || "We had a little trouble getting that ready for you. Let's try again!"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-sprout-200 hover:border-sprout-400 text-sprout-700 font-heading font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
