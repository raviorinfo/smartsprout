import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
          <Loader2 className="w-12 h-12 text-sprout-500 animate-spin" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-sprout-100 animate-pulse"></div>
        </div>
        <p className="text-lg font-heading font-semibold text-sprout-700 animate-pulse">
          Loading something amazing...
        </p>
        <p className="text-sm text-gray-400 font-body mt-2">
          Hang tight, little explorer! 🌱
        </p>
      </div>
    </div>
  );
}
