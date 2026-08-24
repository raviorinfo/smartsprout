"use client";

import React, { useState } from "react";
import { Swords, Loader2, Trophy, ArrowRight, ShieldAlert, Heart, Star } from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

interface QuestState {
  stage: number;
  narrative: string;
  question: string;
  correctAnswer: number;
  isComplete?: boolean;
}

export default function MathQuestsPage() {
  const [setupData, setSetupData] = useState({ name: "", grade: "1st Grade", theme: "knights" });
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quest, setQuest] = useState<QuestState | null>(null);
  
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);

  const startQuest = () => {
    if (!setupData.name.trim()) return;
    setLoading(true);
    setIsStarted(true);
    setHealth(3);
    setScore(0);
    setFeedback("none");
    setUserAnswer("");
    
    // Mock the first quest generation
    setTimeout(() => {
      setQuest({
        stage: 1,
        narrative: `Sir ${setupData.name} approaches the Bridge of Trolls. A grumpy Troll steps out and blocks the path. "You shall not pass until you solve my riddle!" he growls.`,
        question: "What is 5 + 3?",
        correctAnswer: 8
      });
      setLoading(false);
    }, 1200);
  };

  const nextStage = (currentStage: number) => {
    setLoading(true);
    setFeedback("none");
    setUserAnswer("");

    setTimeout(() => {
      if (currentStage === 1) {
        setQuest({
          stage: 2,
          narrative: `The Troll grumbles and steps aside. You cross the bridge and find a glowing treasure chest! But wait, it has a magical lock on it.`,
          question: "What is 10 - 4?",
          correctAnswer: 6
        });
      } else if (currentStage === 2) {
        setQuest({
          stage: 3,
          narrative: `The chest opens, revealing the legendary Star Crystal! But a flock of pesky goblins swoops down to snatch it! Quick, cast a spell to scare them away!`,
          question: "What is 7 + 5?",
          correctAnswer: 12
        });
      } else {
        setQuest({
          stage: 4,
          narrative: `The goblins flee in terror! You have successfully retrieved the Star Crystal and saved the kingdom. You are a true hero!`,
          question: "",
          correctAnswer: 0,
          isComplete: true
        });
      }
      setLoading(false);
    }, 1200);
  };

  const checkAnswer = () => {
    if (!quest || !userAnswer.trim()) return;
    
    const numericAnswer = parseInt(userAnswer, 10);
    
    if (numericAnswer === quest.correctAnswer) {
      setFeedback("correct");
      setScore(score + 100);
      setTimeout(() => {
        nextStage(quest.stage);
      }, 2000);
    } else {
      setFeedback("incorrect");
      setHealth(Math.max(0, health - 1));
      
      if (health - 1 === 0) {
        // Game Over state could be handled here, but we'll let them keep trying for simplicity, just with 0 health.
      }
    }
  };

  return (
    <div className="min-h-screen bg-sprout-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-glow-purple mb-2">
            <Swords className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-indigo-900">
            Epic Math Quests
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Defeat monsters and unlock treasure by solving math puzzles!
          </p>
        </div>

        {!isStarted ? (
          /* Setup UI */
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-sprout-100 max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                Hero's Name
              </label>
              <input
                type="text"
                value={setupData.name}
                onChange={(e) => setSetupData({ ...setupData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-body text-gray-700"
                placeholder="e.g. Maya"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={setupData.grade}
                  onChange={(e) => setSetupData({ ...setupData, grade: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-body text-gray-700 bg-white"
                >
                  <option>Kindergarten</option>
                  <option>1st Grade</option>
                  <option>2nd Grade</option>
                  <option>3rd Grade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Quest Theme
                </label>
                <select
                  value={setupData.theme}
                  onChange={(e) => setSetupData({ ...setupData, theme: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 outline-none transition-all font-body text-gray-700 bg-white"
                >
                  <option value="knights">⚔️ Knights & Dragons</option>
                  <option value="space">🚀 Space Explorers</option>
                  <option value="pirates">🏴‍☠️ Pirate Treasure</option>
                </select>
              </div>
            </div>

            <button
              onClick={startQuest}
              disabled={!setupData.name.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-heading font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Swords className="w-5 h-5" />
              Begin Quest!
            </button>
          </div>
        ) : (
          /* Game UI */
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-sprout-100 max-w-2xl mx-auto relative overflow-hidden">
            {/* Game HUD */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((h) => (
                  <Heart key={h} className={`w-6 h-6 ${h <= health ? "text-candy-rose fill-candy-rose" : "text-gray-200"}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 text-sunshine-deep fill-sunshine-deep" />
                Score: {score}
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-indigo-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-heading font-semibold animate-pulse">Generating next challenge...</p>
              </div>
            ) : quest ? (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {quest.isComplete ? (
                  <div className="text-center space-y-6 py-8">
                    <Trophy className="w-20 h-20 text-sunshine-deep mx-auto" />
                    <h2 className="text-3xl font-heading font-bold text-gray-800">Quest Complete!</h2>
                    <p className="text-lg text-gray-600 font-body">{quest.narrative}</p>
                    <button
                      onClick={() => setIsStarted(false)}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-heading font-bold transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                      <p className="text-lg text-gray-800 font-body leading-relaxed">
                        {quest.narrative}
                      </p>
                    </div>

                    <div className="text-center space-y-6">
                      <div className="text-3xl font-heading font-bold text-indigo-900 tracking-wider bg-white py-4 px-8 rounded-2xl border-2 border-indigo-100 shadow-sm inline-block">
                        {quest.question} = ?
                      </div>

                      <div className="max-w-xs mx-auto">
                        <div className="relative">
                          <input
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                            disabled={feedback === "correct"}
                            className={`w-full text-center text-2xl font-bold py-4 rounded-2xl border-4 transition-all outline-none ${
                              feedback === "correct" ? "border-emerald-400 bg-emerald-50 text-emerald-700" :
                              feedback === "incorrect" ? "border-candy-rose bg-red-50 text-candy-rose" :
                              "border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 text-gray-800"
                            }`}
                            placeholder="Type answer"
                            autoFocus
                          />
                        </div>
                        
                        {feedback === "correct" && (
                          <div className="mt-3 text-emerald-600 font-bold animate-bounce">Correct! +100 Points</div>
                        )}
                        {feedback === "incorrect" && (
                          <div className="mt-3 text-candy-rose font-bold flex items-center justify-center gap-1">
                            <ShieldAlert className="w-4 h-4" /> Try again!
                          </div>
                        )}

                        <button
                          onClick={checkAnswer}
                          disabled={!userAnswer.trim() || feedback === "correct"}
                          className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-heading font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          Submit Answer <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* SEO Bottom */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Eliminate Math Anxiety with Gamification</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Standard math drills can be incredibly stressful for young children. By disguising addition, subtraction, and multiplication problems as "challenges" needed to defeat a troll or fly a spaceship, we shift the child's focus from the fear of being wrong to the excitement of progressing the story. Gamified learning is proven to increase retention and time-on-task!
            </p>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="mathquest-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
