"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  BookOpen,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Volume2,
} from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

interface StoryChapter {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
}

interface Story {
  title: string;
  chapters: StoryChapter[];
}

const themes = [
  { id: "space", label: "🚀 Space", color: "from-sky-medium to-ocean-deep" },
  { id: "dinosaurs", label: "🦕 Dinosaurs", color: "from-sprout-400 to-sprout-600" },
  { id: "magic-forest", label: "🌲 Magic Forest", color: "from-sprout-500 to-sprout-700" },
  { id: "kindness", label: "💖 Kindness", color: "from-candy-pink to-candy-rose" },
  { id: "underwater", label: "🐠 Underwater", color: "from-ocean-medium to-ocean-deep" },
  { id: "superheroes", label: "🦸 Superheroes", color: "from-candy-rose to-lavender-deep" },
];

export default function StoryGeneratorPage() {
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState(5);
  const [theme, setTheme] = useState("space");
  const [storyLength, setStoryLength] = useState<"short" | "medium">("short");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const generateStory = async () => {
    if (!childName.trim()) return;
    setLoading(true);
    setStory(null);

    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: childName.trim(), age, theme, storyLength }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStory(data);
      setCurrentPage(0);

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem("smartsprout_stories") || "[]");
      saved.unshift({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem("smartsprout_stories", JSON.stringify(saved.slice(0, 10)));
    } catch (err) {
      console.error(err);
      alert("Failed to generate story. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const readAloud = useCallback(() => {
    if (!story || !window.speechSynthesis) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const text = story.chapters[currentPage]?.text || "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  }, [story, currentPage, isReading]);

  const downloadPDF = async () => {
    if (!story) return;
    try {
      const { generateStoryPDF } = await import("@/lib/pdfGenerator");
      const pdf = generateStoryPDF({
        title: story.title,
        childName,
        chapters: story.chapters,
      });
      pdf.save(`${story.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const goToPage = (dir: "prev" | "next") => {
    if (!story) return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    if (dir === "prev" && currentPage > 0) setCurrentPage(currentPage - 1);
    if (dir === "next" && currentPage < story.chapters.length - 1)
      setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-candy-pink/10 via-white to-lavender-light/10">
      <div className="page-container">
        {/* Header */}
        <div className="tool-header">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-candy-pink/20 text-candy-rose text-sm font-heading font-bold mb-4">
            <BookOpen className="w-4 h-4" />
            AI Story Maker
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-3">
            Create Magical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-candy-pink to-candy-rose">
              Bedtime Stories
            </span>{" "}
            📚
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Personalized AI stories with your child&apos;s name, favorite themes, and a read-aloud feature!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="card-playful space-y-5">
              <h3 className="font-heading font-bold text-lg text-gray-800">✨ Story Settings</h3>

              {/* Child Name */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-1">
                  Child&apos;s Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter name..."
                  className="input-playful"
                  maxLength={30}
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-1">
                  Age: <span className="text-sprout-600">{age} years old</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-sprout-100 rounded-full appearance-none cursor-pointer accent-sprout-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>3</span><span>10</span>
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={theme === t.id ? "chip-active" : "chip-default"}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Story Length
                </label>
                <div className="flex gap-3">
                  {(["short", "medium"] as const).map((len) => (
                    <button
                      key={len}
                      onClick={() => setStoryLength(len)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-heading font-semibold border-2 transition-all ${
                        storyLength === len
                          ? "bg-sprout-100 border-sprout-400 text-sprout-700"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {len === "short" ? "📖 Short (5 pages)" : "📚 Medium (7 pages)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateStory}
                disabled={loading || !childName.trim()}
                className="btn-candy w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Story
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
              <AdSenseBanner slot="story-sidebar" format="rectangle" />
            </div>
          </div>

          {/* Story Viewer */}
          <div className="lg:col-span-3">
            {!story && !loading && (
              <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4 animate-float">📖</div>
                <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                  Your story will appear here
                </h3>
                <p className="text-gray-400 text-sm">
                  Fill in the details and click Generate Story to begin!
                </p>
              </div>
            )}

            {loading && (
              <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
                <Loader2 className="w-12 h-12 text-candy-rose animate-spin mb-4" />
                <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                  Writing your story...
                </h3>
                <p className="text-gray-400 text-sm">
                  Our AI author is crafting a magical tale for {childName || "your little one"}! ✨
                </p>
              </div>
            )}

            {story && (
              <div className="space-y-4 animate-fade-in">
                {/* Title Card */}
                <div className="bg-gradient-to-r from-candy-pink to-candy-rose rounded-3xl p-6 text-white text-center shadow-playful-lg">
                  <h2 className="font-heading font-black text-2xl sm:text-3xl mb-1">
                    {story.title}
                  </h2>
                  <p className="text-white/80 text-sm font-heading">
                    A story for {childName}
                  </p>
                </div>

                {/* Book Page */}
                <div className="card-playful min-h-[300px] relative">
                  {/* Page badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-candy-pink to-candy-rose text-white text-xs font-bold flex items-center justify-center">
                    {story.chapters[currentPage]?.pageNumber}
                  </div>

                  <div className="pr-12 pb-16">
                    <p className="text-gray-700 text-lg leading-relaxed font-body">
                      {story.chapters[currentPage]?.text}
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <button
                      onClick={() => goToPage("prev")}
                      disabled={currentPage === 0}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {story.chapters.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setCurrentPage(i); window.speechSynthesis.cancel(); setIsReading(false); }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i === currentPage ? "bg-candy-rose scale-125" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => goToPage("next")}
                      disabled={currentPage === story.chapters.length - 1}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button onClick={readAloud} className="btn-ocean flex-1">
                    {isReading ? (
                      <><Pause className="w-4 h-4" /> Pause</>
                    ) : (
                      <><Volume2 className="w-4 h-4" /> Read to Me</>
                    )}
                  </button>
                  <button onClick={downloadPDF} className="btn-secondary flex-1">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO & Educational Content */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Generate Personalized Bedtime Stories with AI</h2>
            <p className="text-gray-600 font-body leading-relaxed mb-4">
              Make bedtime magical with SmartSprout's custom AI story generator. By entering your child's name, age, and favorite themes, our advanced AI weaves a completely unique, safe, and engaging narrative in seconds. From exploring space with friendly robots to discovering hidden magical forests, the possibilities are endless.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">How It Benefits Early Literacy</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              When children see themselves as the hero of a story, their engagement skyrockets. Personalized storytelling is a proven method to build a lifelong love for reading. It helps expand vocabulary, improves listening comprehension, and encourages imaginative thinking. Our stories are specifically tailored to match the reading level appropriate for your child's age.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-bold text-gray-800">Is the story generator safe for young children?</h3>
                <p className="text-gray-600 text-sm mt-1">Yes, absolutely. Our AI model is strictly prompted and filtered to ensure every story is 100% kid-friendly, violence-free, and appropriate for early childhood.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">Can I save the stories for later?</h3>
                <p className="text-gray-600 text-sm mt-1">Yes! You can instantly download any generated story as a beautifully formatted PDF to keep forever or print out for a screen-free reading experience.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">How does the "Read to Me" feature work?</h3>
                <p className="text-gray-600 text-sm mt-1">We use text-to-speech technology built directly into your browser to read the story aloud. It's a great feature for younger kids who are still learning to read!</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <AdSenseBanner slot="story-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
