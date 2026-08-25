"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  Loader2,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Zap,
  Printer,
} from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

interface Activity {
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  safetyWarnings: string[];
  timeEstimate: string;
  funFact: string;
}

const supplyOptions = [
  { id: "paper", label: "📄 Paper" },
  { id: "cardboard", label: "📦 Cardboard" },
  { id: "scissors", label: "✂️ Scissors" },
  { id: "glue", label: "🧴 Glue" },
  { id: "markers", label: "🖍️ Markers" },
  { id: "string", label: "🧵 String" },
  { id: "tape", label: "📎 Tape" },
  { id: "paint", label: "🎨 Paint" },
  { id: "cotton-balls", label: "☁️ Cotton Balls" },
  { id: "sticks", label: "🪵 Popsicle Sticks" },
  { id: "foil", label: "✨ Aluminum Foil" },
  { id: "plastic-bottles", label: "🍶 Plastic Bottles" },
];

const timeLimits = [
  { id: "15 minutes", label: "⚡ 15 min" },
  { id: "30 minutes", label: "⏱️ 30 min" },
  { id: "1 hour", label: "🕐 1 hour" },
];

export default function ActivityFinderPage() {
  const [supplies, setSupplies] = useState<string[]>(["paper", "markers"]);
  const [age, setAge] = useState(6);
  const [timeLimit, setTimeLimit] = useState("30 minutes");
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const toggleSupply = (id: string) => {
    setSupplies((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const generateActivities = async () => {
    if (supplies.length === 0) return;
    setLoading(true);
    setActivities([]);

    try {
      const supplyLabels = supplies.map(
        (s) => supplyOptions.find((o) => o.id === s)?.label.replace(/^[^\s]+\s/, "") || s
      );
      const res = await fetch("/api/generate-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplies: supplyLabels, age, timeLimit }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setActivities(data.activities || []);

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem("kiddleaf_activities") || "[]");
      saved.unshift({ activities: data.activities, createdAt: new Date().toISOString() });
      localStorage.setItem("kiddleaf_activities", JSON.stringify(saved.slice(0, 10)));
    } catch (err) {
      console.error(err);
      alert("Failed to generate activities. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const printActivities = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sunshine-light/20 via-white to-sprout-50/30">
      <div className="page-container">
        {/* Header */}
        <div className="tool-header">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunshine-light/40 text-sunshine-deep text-sm font-heading font-bold mb-4">
            <Lightbulb className="w-4 h-4" />
            Screen-Free Activities
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-3">
            Screen-Free{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunshine-medium to-sunshine-deep">
              Activity Finder
            </span>{" "}
            💡
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Discover fun crafts, experiments, and games using supplies you already have at home!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="card-playful space-y-5">
              <h3 className="font-heading font-bold text-lg text-gray-800">🎒 What do you have?</h3>

              {/* Supplies */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Available Supplies
                </label>
                <div className="flex flex-wrap gap-2">
                  {supplyOptions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSupply(s.id)}
                      className={supplies.includes(s.id) ? "chip-active" : "chip-default"}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {supplies.length} selected
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-1">
                  Child&apos;s Age: <span className="text-sprout-600">{age} years old</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-sunshine-light rounded-full appearance-none cursor-pointer accent-sunshine-deep"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>3</span><span>10</span>
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Time Available
                </label>
                <div className="flex gap-2">
                  {timeLimits.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTimeLimit(t.id)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-heading font-semibold border-2 transition-all ${
                        timeLimit === t.id
                          ? "bg-sunshine-light border-sunshine-medium text-yellow-800"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateActivities}
                disabled={loading || supplies.length === 0}
                className="btn-primary w-full bg-gradient-to-r from-sunshine-medium to-sunshine-deep disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding Activities...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Find Activities
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
              <AdSenseBanner slot="activity-sidebar" format="rectangle" />
            </div>
          </div>

          {/* Activities */}
          <div className="lg:col-span-3">
            {activities.length === 0 && !loading && (
              <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4 animate-float">🎨</div>
                <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                  Activities will appear here
                </h3>
                <p className="text-gray-400 text-sm">
                  Select your supplies and click Find Activities!
                </p>
              </div>
            )}

            {loading && (
              <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
                <Loader2 className="w-12 h-12 text-sunshine-medium animate-spin mb-4" />
                <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                  Finding fun activities...
                </h3>
                <p className="text-gray-400 text-sm">
                  Searching for the best screen-free fun! 🔍
                </p>
              </div>
            )}

            {activities.length > 0 && (
              <div className="space-y-6 animate-fade-in print:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg text-gray-800">
                    🎉 {activities.length} Activities Found!
                  </h3>
                  <button onClick={printActivities} className="btn-secondary text-sm py-2 px-4 print:hidden">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>

                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="card-playful space-y-4 hover:shadow-playful-lg transition-shadow"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Title */}
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading font-bold text-xl text-gray-800">
                        {activity.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-heading font-semibold text-sunshine-deep bg-sunshine-light px-3 py-1 rounded-full whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.timeEstimate}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm">{activity.description}</p>

                    {/* Materials */}
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-heading font-bold text-gray-700 mb-2">
                        <Package className="w-4 h-4 text-sky-medium" />
                        Materials Needed
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activity.materials.map((m, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-sky-light/30 text-sky-deep text-xs font-semibold"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Steps */}
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-heading font-bold text-gray-700 mb-2">
                        <CheckCircle className="w-4 h-4 text-sprout-500" />
                        Step-by-Step
                      </div>
                      <ol className="space-y-2">
                        {activity.steps.map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sprout-100 text-sprout-700 text-xs font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Safety Warnings */}
                    {activity.safetyWarnings && activity.safetyWarnings.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                        <div className="flex items-center gap-1.5 text-sm font-heading font-bold text-amber-700 mb-1">
                          <AlertTriangle className="w-4 h-4" />
                          Safety Notes
                        </div>
                        <ul className="space-y-1">
                          {activity.safetyWarnings.map((w, i) => (
                            <li key={i} className="text-xs text-amber-600 flex items-start gap-1">
                              <span>⚠️</span> {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fun Fact */}
                    {activity.funFact && (
                      <div className="bg-lavender-light/30 border border-lavender-light rounded-2xl p-3">
                        <div className="flex items-center gap-1.5 text-sm font-heading font-bold text-lavender-deep mb-1">
                          <Zap className="w-4 h-4" />
                          Fun Fact!
                        </div>
                        <p className="text-xs text-purple-700">{activity.funFact}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO & Educational Content */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Find the Perfect Screen-Free Activity</h2>
            <p className="text-gray-600 font-body leading-relaxed mb-4">
              Struggling to find ways to keep your kids entertained without handing them a tablet? The Kiddleaf Activity Finder is your ultimate parenting hack! Just select the age of your child, how much time you have, and whether you're indoors or outdoors. Our AI will instantly suggest engaging, educational, and fun activities you can do together using items you likely already have around the house.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Why Screen-Free Play Matters</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              In early childhood, the brain learns best through physical interaction. Building a fort, doing a science experiment in the kitchen, or going on a nature scavenger hunt engages multiple senses simultaneously. This active, tactile play builds stronger neural pathways, improves gross and fine motor skills, and fosters emotional resilience and social bonding far better than passive screen time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-bold text-gray-800">Do I need to buy expensive materials?</h3>
                <p className="text-gray-600 text-sm mt-1">Not at all! We specifically instruct our AI to prioritize activities that use everyday household items (like cardboard boxes, string, or baking soda).</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">Are there activities for all ages?</h3>
                <p className="text-gray-600 text-sm mt-1">Yes, the generator scales from simple sensory play for toddlers to more complex science and engineering challenges for older kids.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">How many activities does it generate at once?</h3>
                <p className="text-gray-600 text-sm mt-1">Every time you click "Find Activities", we generate 3 brand new, unique ideas complete with step-by-step instructions and safety notes.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <AdSenseBanner slot="activity-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
