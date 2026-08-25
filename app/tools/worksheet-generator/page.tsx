"use client";

import React, { useState, useCallback } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Loader2,
  Eye,
  CheckCircle,
  Library,
  BookOpen,
  XCircle,
} from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";
import WorksheetPDFModal from "@/components/WorksheetPDFModal";
import { useBookCart } from "@/lib/store";

interface WorksheetQuestion {
  question: string;
  answer: string;
  options?: string[];
}

interface Worksheet {
  title: string;
  subject: string;
  grade: string;
  difficulty: string;
  questions: WorksheetQuestion[];
}

const mathSubTypes = [
  { id: "addition", label: "➕ Addition" },
  { id: "subtraction", label: "➖ Subtraction" },
  { id: "multiplication", label: "✖️ Multiplication" },
  { id: "fractions", label: "🔢 Fractions" },
];

const englishSubTypes = [
  { id: "trace-words", label: "✍️ Trace Words" },
  { id: "word-search", label: "🔎 Word Search" },
  { id: "missing-letters", label: "🔤 Missing Letters" },
];

const hindiSubTypes = [
  { id: "varnamala", label: "कखग Varnamala" },
  { id: "matras", label: "✍️ Matras" },
  { id: "vocabulary", label: "📖 Vocabulary" },
];

const gkSubTypes = [
  { id: "animals", label: "🦁 Animals" },
  { id: "planets", label: "🪐 Planets & Space" },
  { id: "countries", label: "🌍 Countries & Flags" },
  { id: "science", label: "🔬 Basic Science" },
];

const grades = [
  { id: "preschool", label: "🌼 Preschool" },
  { id: "kindergarten", label: "🎒 Kindergarten" },
  { id: "grade1", label: "1️⃣ Grade 1" },
  { id: "grade2", label: "2️⃣ Grade 2" },
  { id: "grade3", label: "3️⃣ Grade 3" },
  { id: "grade4", label: "4️⃣ Grade 4" },
  { id: "grade5", label: "5️⃣ Grade 5" },
];

const difficulties = [
  { id: "easy", label: "🟢 Easy", color: "bg-sprout-100 border-sprout-400 text-sprout-700" },
  { id: "medium", label: "🟡 Medium", color: "bg-sunshine-light border-sunshine-medium text-yellow-800" },
  { id: "hard", label: "🔴 Hard", color: "bg-red-50 border-red-300 text-red-700" },
];

export default function WorksheetGeneratorPage() {
  const [subject, setSubject] = useState<"math" | "english" | "hindi" | "gk">("math");
  const [subType, setSubType] = useState("addition");
  const [grade, setGrade] = useState("grade1");
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookProgress, setBookProgress] = useState(0);
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addWorksheet } = useBookCart();

  const subTypes = subject === "math" ? mathSubTypes : subject === "english" ? englishSubTypes : subject === "hindi" ? hindiSubTypes : gkSubTypes;

  const generateWorksheet = async () => {
    setLoading(true);
    setWorksheet(null);
    setUserAnswers({});
    setIsChecking(false);
    setShowAnswers(false);

    try {
      const res = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, subType, grade, difficulty }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setWorksheet(data);

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem("kiddleaf_worksheets") || "[]");
      saved.unshift({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem("kiddleaf_worksheets", JSON.stringify(saved.slice(0, 10)));
    } catch (err) {
      console.error(err);
      alert("Failed to generate worksheet. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const confirmDownloadPDF = useCallback(async () => {
    if (!worksheet) return;
    try {
      const { generateWorksheetPDF, forceDownloadPDF } = await import("@/lib/pdfGenerator");
      const pdf = generateWorksheetPDF(worksheet);
      const safeTitle = worksheet.title.replace(/[^a-zA-Z0-9_-]/g, "_") || "Worksheet";
      forceDownloadPDF(pdf, `${safeTitle}.pdf`);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again!");
    }
  }, [worksheet]);

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handleAddToBook = () => {
    if (!worksheet) return;
    addWorksheet(worksheet);
    alert("Added to Workbook!");
  };

  const generateFullBook = async () => {
    setLoadingBook(true);
    setBookProgress(0);
    try {
      let requests = [];
      if (subject === "math") {
        requests = [
          { subject: "math", subType: "addition", grade, difficulty },
          { subject: "math", subType: "subtraction", grade, difficulty },
          { subject: "math", subType: "multiplication", grade, difficulty },
          { subject: "math", subType: "fractions", grade, difficulty },
          { subject: "math", subType: "addition", grade, difficulty: "hard" },
        ];
      } else if (subject === "english") {
        requests = [
          { subject: "english", subType: "missing-letters", grade, difficulty },
          { subject: "english", subType: "trace-words", grade, difficulty },
          { subject: "english", subType: "word-search", grade, difficulty },
          { subject: "english", subType: "missing-letters", grade, difficulty: "hard" },
          { subject: "english", subType: "trace-words", grade, difficulty: "hard" },
        ];
      } else if (subject === "hindi") {
        requests = [
          { subject: "hindi", subType: "varnamala", grade, difficulty },
          { subject: "hindi", subType: "matras", grade, difficulty },
          { subject: "hindi", subType: "vocabulary", grade, difficulty },
          { subject: "hindi", subType: "varnamala", grade, difficulty: "hard" },
          { subject: "hindi", subType: "matras", grade, difficulty: "hard" },
        ];
      } else {
        requests = [
          { subject: "gk", subType: "animals", grade, difficulty },
          { subject: "gk", subType: "planets", grade, difficulty },
          { subject: "gk", subType: "countries", grade, difficulty },
          { subject: "gk", subType: "science", grade, difficulty },
          { subject: "gk", subType: "animals", grade, difficulty: "hard" },
        ];
      }
      
      const results = [];
      for (let i = 0; i < requests.length; i++) {
        setBookProgress(i + 1);
        const res = await fetch("/api/generate-worksheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requests[i]),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        results.push(data);
      }
      
      const { generateWorksheetBookPDF, forceDownloadPDF } = await import("@/lib/pdfGenerator");
      const pdf = generateWorksheetBookPDF("My Smart Workbook", "Awesome Student", results);
      forceDownloadPDF(pdf, `Complete_Workbook_${grade}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate complete workbook. Please try again!");
    } finally {
      setLoadingBook(false);
      setBookProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light/20 via-white to-ocean-light/10">
      <div className="page-container">
        {/* Header */}
        <div className="tool-header">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-light/40 text-sky-deep text-sm font-heading font-bold mb-4">
            <FileText className="w-4 h-4" />
            Worksheet Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-3">
            Printable{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-medium to-ocean-deep">
              Worksheets
            </span>{" "}
            📝
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Generate custom math and English worksheets with instant PDF downloads!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="card-playful space-y-5">
              <h3 className="font-heading font-bold text-lg text-gray-800">📋 Worksheet Settings</h3>

              {/* Subject Toggle */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                {/* Subject Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto whitespace-nowrap">
                  <button
                    onClick={() => { setSubject("math"); setSubType("addition"); }}
                    className={`flex-1 py-2 px-4 rounded-lg font-heading font-bold text-sm transition-all min-w-[80px] ${
                      subject === "math" ? "bg-white text-ocean-deep shadow-sm" : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    🔢 Math
                  </button>
                  <button
                    onClick={() => { setSubject("english"); setSubType("trace-words"); }}
                    className={`flex-1 py-2 px-4 rounded-lg font-heading font-bold text-sm transition-all min-w-[80px] ${
                      subject === "english" ? "bg-white text-emerald-deep shadow-sm" : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    📝 English
                  </button>
                  <button
                    onClick={() => { setSubject("hindi"); setSubType("varnamala"); }}
                    className={`flex-1 py-2 px-4 rounded-lg font-heading font-bold text-sm transition-all min-w-[80px] ${
                      subject === "hindi" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    क Hindi
                  </button>
                  <button
                    onClick={() => { setSubject("gk"); setSubType("animals"); }}
                    className={`flex-1 py-2 px-4 rounded-lg font-heading font-bold text-sm transition-all min-w-[80px] ${
                      subject === "gk" ? "bg-white text-purple-500 shadow-sm" : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    🌍 GK
                  </button>
                </div>
              </div>

              {/* Sub-type */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {subTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSubType(t.id)}
                      className={subType === t.id ? "chip-active" : "chip-default"}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="select-playful"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-700 mb-2">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-heading font-semibold border-2 transition-all ${
                        difficulty === d.id ? d.color : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Buttons */}
              <div className="space-y-3">
                <button
                  onClick={generateWorksheet}
                  disabled={loading || loadingBook}
                  className="btn-ocean w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Single Worksheet
                    </>
                  )}
                </button>
                
                <button
                  onClick={generateFullBook}
                  disabled={loading || loadingBook}
                  className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed border-ocean-medium text-ocean-deep hover:bg-ocean-light/10"
                >
                  {loadingBook ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Book ({bookProgress}/5)...
                    </>
                  ) : (
                    <>
                      <Library className="w-5 h-5" />
                      Generate Complete 5-Page Workbook
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <AdSenseBanner slot="worksheet-sidebar" format="rectangle" />
            </div>
          </div>

          {/* Worksheet Preview */}
          <div className="lg:col-span-3">
            {!worksheet && !loading && (
              <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-6xl mb-4 animate-float">📝</div>
                <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                  Your worksheet will appear here
                </h3>
                <p className="text-gray-400 text-sm">
                  Choose settings and click Generate Worksheet!
                </p>
              </div>
            )}

            {loading && (
              <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
                <Loader2 className="w-12 h-12 text-sky-medium animate-spin mb-4" />
                <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                  Creating your worksheet...
                </h3>
                <p className="text-gray-400 text-sm">Almost ready! ✨</p>
              </div>
            )}

            {worksheet && (
              <div className="space-y-4 animate-fade-in">
                {/* Worksheet Header */}
                <div className="bg-gradient-to-r from-sky-medium to-ocean-deep rounded-3xl p-6 text-white shadow-playful-lg">
                  <h2 className="font-heading font-black text-2xl mb-1">
                    {worksheet.title}
                  </h2>
                  <p className="text-white/80 text-sm font-heading">
                    {worksheet.grade} • {worksheet.difficulty}
                  </p>
                </div>

                {/* Questions */}
                <div className="card-playful space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="font-heading font-bold text-gray-700">
                      📋 Questions ({worksheet.questions.length})
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsChecking(true)}
                        className="flex items-center gap-1 text-sm text-sky-deep font-heading font-semibold hover:underline bg-sky-light/20 px-2 py-1 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Check Answers
                      </button>
                      <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="flex items-center gap-1 text-sm text-gray-500 font-heading font-semibold hover:underline px-2 py-1"
                      >
                        <Eye className="w-4 h-4" />
                        {showAnswers ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {worksheet.questions.map((q, i) => {
                    const userAnswer = userAnswers[i] || "";
                    const isCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
                    
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/50 hover:bg-sky-light/10 transition-colors"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-sky-light text-sky-deep text-sm font-bold flex items-center justify-center mt-1">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-700 font-body mb-2">{q.question}</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={userAnswer}
                              onChange={(e) => {
                                setUserAnswers(prev => ({ ...prev, [i]: e.target.value }));
                                if (isChecking) setIsChecking(false);
                              }}
                              placeholder="Type your answer here..."
                              className={`input-playful text-sm py-1.5 px-3 w-full max-w-[250px] ${
                                isChecking ? (isCorrect ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50') : ''
                              }`}
                            />
                            {isChecking && (
                              isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )
                            )}
                          </div>
                          {(showAnswers || (isChecking && !isCorrect)) && (
                            <div className="mt-2 flex items-center gap-1 text-sm text-emerald-700 font-semibold bg-emerald-100 px-3 py-1.5 rounded-lg w-fit">
                              <CheckCircle className="w-4 h-4" />
                              Correct Answer: {q.answer}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button onClick={handleAddToBook} className="btn-primary flex-1 bg-gradient-to-r from-sky-medium to-ocean-medium text-white border-0 min-w-[150px]">
                    <Library className="w-4 h-4" /> Add to Workbook
                  </button>
                  <button onClick={handleDownloadClick} className="btn-secondary flex-1 min-w-[150px]">
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
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">How to Use the Free Math Worksheet Generator</h2>
            <p className="text-gray-600 font-body leading-relaxed mb-4">
              Kiddleaf's AI-powered worksheet generator makes it incredibly easy to create custom, printable worksheets for your children or students. Whether you need addition practice for a first grader or complex fraction problems for older kids, our tool generates unique math problems in seconds.
            </p>
            <ol className="list-decimal list-inside text-gray-600 font-body space-y-2">
              <li>Select your preferred subject (Math, English, Hindi, or GK).</li>
              <li>Choose the specific topic (e.g., Addition, Subtraction).</li>
              <li>Pick the appropriate grade level and difficulty setting.</li>
              <li>Click <strong>Generate Single Worksheet</strong> for a quick practice page, or <strong>Generate Complete 5-Page Workbook</strong> for a full week's worth of homework!</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">The Benefits of Printable Worksheets for Kids</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              While digital learning tools are valuable, research shows that the physical act of writing numbers and letters on paper significantly improves memory retention and fine motor skills. Screen-free practice worksheets help children focus without digital distractions, reducing eye strain and improving their attention spans. Plus, you get a physical record of their progress!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-bold text-gray-800">Is the worksheet generator completely free?</h3>
                <p className="text-gray-600 text-sm mt-1">Yes! All worksheets generated on Kiddleaf are 100% free to create, download, and print for personal or classroom use.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">Do the worksheets come with an answer key?</h3>
                <p className="text-gray-600 text-sm mt-1">Yes. If you choose to complete them online, you can use the "Check Answers" button. If you download them as a PDF, an answer key is automatically included on the final page of the document for easy grading.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">Can I use these worksheets in my classroom?</h3>
                <p className="text-gray-600 text-sm mt-1">Absolutely. Teachers are welcome to generate and print as many worksheets and workbooks as they need for their students.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <AdSenseBanner slot="worksheet-bottom" format="horizontal" />
        </div>
      </div>
      
      {worksheet && (
        <WorksheetPDFModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDownload={confirmDownloadPDF}
          title={worksheet.title}
        />
      )}
    </div>
  );
}
