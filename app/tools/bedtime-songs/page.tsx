"use client";

import React, { useState } from "react";
import { Music, Loader2, Moon, Star, Play, Pause, Download } from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

export default function BedtimeSongsPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dayActivity: "",
    theme: "gentle piano",
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [songLyrics, setSongLyrics] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dayActivity.trim()) return;
    
    setIsGenerating(true);
    setSongLyrics(null);
    setIsPlaying(false);

    // Mock API call
    setTimeout(() => {
      const mockLyrics = `
(Verse 1)
The sun goes down, the stars come out,
It's time to rest for little ${formData.name}.
You played so hard, you ran about,
And ${formData.dayActivity.toLowerCase()} without a doubt.

(Chorus)
Close your eyes, drift away,
You had a truly wonderful day.
The moon is smiling shining bright,
Sweet dreams, my love, goodnight, goodnight.

(Verse 2)
The world is quiet, soft and still,
The wind is whispering on the hill.
Tomorrow brings more games to play,
But now it's time to end the day.

(Outro)
Sleep tight, little one, sleep tight...
Goodnight.
      `.trim();
      
      setSongLyrics(mockLyrics);
      setIsGenerating(false);
    }, 2500);
  };

  const togglePlay = () => {
    // In a real app, this would play TTS audio of the song
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-sprout-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-800 to-blue-900 shadow-glow-blue mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            <Moon className="w-8 h-8 text-yellow-200 z-10" />
            <Star className="w-3 h-3 text-white absolute top-3 right-3 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-indigo-950">
            Bedtime Song Generator
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Turn your child's day into a personalized, soothing lullaby.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-sprout-100 max-w-2xl mx-auto space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Child's Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-body text-gray-700"
                  placeholder="e.g. Emma"
                />
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-body text-gray-700"
                  placeholder="e.g. 4"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                What did they do today?
              </label>
              <textarea
                required
                rows={3}
                value={formData.dayActivity}
                onChange={(e) => setFormData({ ...formData, dayActivity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-body text-gray-700 resize-none"
                placeholder="e.g. went to the park and saw some ducks in the pond"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !formData.name.trim() || !formData.dayActivity.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-800 to-blue-900 hover:from-indigo-900 hover:to-blue-950 text-white rounded-xl font-heading font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Composing Lullaby...
                </>
              ) : (
                <>
                  <Music className="w-5 h-5" />
                  Create Bedtime Song
                </>
              )}
            </button>
          </form>

          {/* Results Area */}
          {songLyrics && (
            <div className="mt-8 pt-8 border-t border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-b from-indigo-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-indigo-100 text-center relative overflow-hidden">
                {/* Decorative stars */}
                <Star className="absolute top-4 left-4 w-4 h-4 text-yellow-400/50" />
                <Star className="absolute bottom-4 right-4 w-6 h-6 text-yellow-400/50" />
                <Star className="absolute top-1/2 right-8 w-3 h-3 text-yellow-400/50" />
                
                <h3 className="font-heading font-bold text-2xl text-indigo-900 mb-6 font-serif italic">
                  A Song for {formData.name}
                </h3>
                
                <div className="whitespace-pre-line text-lg text-indigo-950/80 font-serif leading-relaxed mb-8">
                  {songLyrics}
                </div>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={togglePlay}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-heading font-semibold transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isPlaying ? "Pause" : "Play Song (Preview)"}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-indigo-900 border border-indigo-200 rounded-full font-heading font-semibold transition-colors">
                    <Download className="w-5 h-5" />
                    Save Lyrics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Bottom */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">The Power of a Personalized Bedtime Routine</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Transitioning from a busy day of play to restful sleep can be difficult for young children. Establishing a consistent, calming bedtime routine is crucial. By summarizing the events of their day into a soothing, rhyming lullaby, you help them process their memories and wind down emotionally. Singing to your child also releases oxytocin, reducing stress and promoting deeper, more restful sleep.
            </p>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="bedtime-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
