import Link from "next/link";
import { Sprout, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-sprout-50 to-white px-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[160px] font-heading font-black text-sprout-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sprout-400 to-sprout-500 flex items-center justify-center shadow-xl shadow-sprout-500/30 animate-bounce">
              <Sprout className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-black text-gray-900 mb-4">
          Oops! Page Not Found 🌱
        </h1>
        <p className="text-lg text-gray-500 font-body mb-8 leading-relaxed">
          Looks like this little sprout wandered off the path!
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sprout-400 to-sprout-500 hover:from-sprout-300 hover:to-sprout-400 text-white font-heading font-bold rounded-2xl shadow-lg shadow-sprout-500/30 hover:shadow-sprout-400/40 hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/tools/story-generator"
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-sprout-200 hover:border-sprout-400 text-sprout-700 font-heading font-bold rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Search className="w-5 h-5" />
            Explore Tools
          </Link>
        </div>

        {/* Fun decorations */}
        <div className="mt-12 flex items-center justify-center gap-4 text-4xl opacity-40">
          <span className="animate-float">🦕</span>
          <span className="animate-float-delayed">🚀</span>
          <span className="animate-float">🎨</span>
          <span className="animate-float-delayed">📚</span>
          <span className="animate-float">✨</span>
        </div>
      </div>
    </div>
  );
}
