"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Map, ChevronRight, User, RotateCcw } from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

interface StoryNode {
  chapter: number;
  text: string;
  choices?: {
    id: string;
    text: string;
  }[];
  isEnding?: boolean;
}

export default function AdventureStoriesPage() {
  const [setupData, setSetupData] = useState({ name: "", age: 5, setting: "magical forest" });
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storyHistory, setStoryHistory] = useState<StoryNode[]>([]);

  const handleStart = async () => {
    if (!setupData.name.trim()) return;
    setLoading(true);
    setIsStarted(true);
    
    try {
      const res = await fetch("/api/generate-adventure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: setupData.name.trim(),
          age: setupData.age,
          setting: setupData.setting,
          chapter: 0,
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStoryHistory([data]);
    } catch (err) {
      console.error("Adventure start error:", err);
      alert("Failed to start adventure. Please try again!");
      setIsStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choiceId: string) => {
    setLoading(true);
    
    const currentChapter = storyHistory.length;
    const lastNode = storyHistory[storyHistory.length - 1];
    
    try {
      const res = await fetch("/api/generate-adventure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: setupData.name.trim(),
          age: setupData.age,
          setting: setupData.setting,
          choiceId,
          chapter: currentChapter,
          previousText: lastNode?.text || "",
        }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStoryHistory([...storyHistory, data]);
    } catch (err) {
      console.error("Adventure choice error:", err);
      alert("Failed to continue the adventure. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const resetStory = () => {
    setIsStarted(false);
    setStoryHistory([]);
  };

  return (
    <div className="min-h-screen bg-sprout-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-glow-amber mb-2">
            <Map className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-amber-900">
            Interactive Adventures
          </h1>
          <p className="text-lg text-gray-600 font-body">
            You are the hero! Make choices and explore magical worlds.
          </p>
        </div>

        {!isStarted ? (
          /* Setup UI */
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-sprout-100 max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                Hero's Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={setupData.name}
                  onChange={(e) => setSetupData({ ...setupData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all font-body text-gray-700"
                  placeholder="e.g. Leo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                Choose a Setting
              </label>
              <select
                value={setupData.setting}
                onChange={(e) => setSetupData({ ...setupData, setting: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all font-body text-gray-700 bg-white"
              >
                <option value="magical forest">🌲 Magical Forest</option>
                <option value="deep space">🚀 Deep Space</option>
                <option value="underwater kingdom">🌊 Underwater Kingdom</option>
                <option value="dinosaur jungle">🦕 Dinosaur Jungle</option>
              </select>
            </div>

            <button
              onClick={handleStart}
              disabled={!setupData.name.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl font-heading font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start My Adventure!
            </button>
          </div>
        ) : (
          /* Story Playback UI */
          <div className="space-y-6">
            {storyHistory.map((node, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-sprout-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-amber-600 font-heading font-bold text-sm">
                  <Map className="w-4 h-4" />
                  Chapter {node.chapter}
                </div>
                <p className="text-xl text-gray-800 font-body leading-relaxed">
                  {node.text}
                </p>

                {/* Only show choices on the latest node if it's not the end */}
                {index === storyHistory.length - 1 && !node.isEnding && !loading && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-heading font-bold text-gray-700">What do you want to do next?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {node.choices?.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoice(choice.id)}
                          className="px-6 py-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 hover:border-amber-400 text-amber-900 rounded-2xl font-heading font-semibold transition-all flex items-center justify-between group text-left"
                        >
                          {choice.text}
                          <ChevronRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading State for next chapter */}
                {index === storyHistory.length - 1 && loading && (
                  <div className="mt-8 flex items-center gap-3 text-amber-600 font-heading font-semibold animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating the next chapter...
                  </div>
                )}

                {/* Ending State */}
                {index === storyHistory.length - 1 && node.isEnding && (
                  <div className="mt-8 text-center space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-2xl font-heading font-bold text-sprout-600">The End!</h3>
                    <button
                      onClick={resetStory}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-heading font-semibold transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SEO Bottom */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">What is an Interactive Adventure?</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Unlike a traditional story where a child just listens, an interactive "Choose Your Own Adventure" puts them in the driver's seat. Our AI generates the story on the fly, and at the end of each chapter, your child must make a decision that alters the course of the narrative. It's reading turned into a video game!
            </p>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="adventure-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
