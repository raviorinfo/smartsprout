"use client";

import React, { useState, useRef } from "react";
import {
  Palette,
  Sparkles,
  Download,
  Printer,
  Loader2,
  ImageIcon,
  Library,
} from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";
import InteractiveCanvas, { InteractiveCanvasRef } from "@/components/InteractiveCanvas";
import { useBookCart } from "@/lib/store";

const presets = [
  { id: "animals", label: "🐻 Animals", prompt: "cute baby bear eating honey" },
  { id: "vehicles", label: "🚗 Vehicles", prompt: "cool race car with flames" },
  { id: "superheroes", label: "🦸 Superheroes", prompt: "kid superhero flying through clouds" },
  { id: "space", label: "🚀 Space", prompt: "astronaut on the moon with Earth in background" },
  { id: "dinosaurs", label: "🦕 Dinosaurs", prompt: "friendly dinosaur in a garden" },
  { id: "underwater", label: "🐠 Underwater", prompt: "cute fish and seahorse in coral reef" },
];

export default function ColoringPagesPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBook, setLoadingBook] = useState(false);
  const [bookProgress, setBookProgress] = useState(0);
  const [result, setResult] = useState<{ image: string; prompt: string; isMock: boolean } | null>(null);
  
  const { addColoringPage } = useBookCart();
  const canvasRef = useRef<InteractiveCanvasRef>(null);

  const generate = async (inputPrompt?: string) => {
    const finalPrompt = inputPrompt || prompt;
    if (!finalPrompt.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate-coloring-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem("smartsprout_coloring") || "[]");
      saved.unshift({ prompt: finalPrompt, createdAt: new Date().toISOString() });
      localStorage.setItem("smartsprout_coloring", JSON.stringify(saved.slice(0, 10)));
    } catch (err) {
      console.error(err);
      alert("Failed to generate coloring page. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!result) return;
    try {
      const { generateColoringPagePDF, forceDownloadPDF } = await import("@/lib/pdfGenerator");
      
      let imageUrlForPdf = result.image;
      if (canvasRef.current) {
        imageUrlForPdf = await canvasRef.current.getCombinedImage();
      }
      
      // jsPDF does not support SVG data URLs, convert to PNG if needed
      if (imageUrlForPdf.startsWith("data:image/svg+xml")) {
        const img = new Image();
        img.src = imageUrlForPdf;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 1024, 1024);
          ctx.drawImage(img, 0, 0, 1024, 1024);
          imageUrlForPdf = canvas.toDataURL("image/png");
        }
      }

      const pdf = generateColoringPagePDF(result.prompt, imageUrlForPdf);
      const safeTitle = result.prompt.replace(/[^a-zA-Z0-9_-]/g, "_") || "Coloring_Page";
      forceDownloadPDF(pdf, `${safeTitle}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Please try again!");
    }
  };

  const printPage = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Coloring Page - SmartSprout</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh;">
            <img src="${result.image}" style="max-width:100%; max-height:100vh;" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleAddToBook = async () => {
    if (!result) return;
    let finalImage = result.image;
    if (canvasRef.current) {
      finalImage = await canvasRef.current.getCombinedImage();
    }
    addColoringPage({ prompt: result.prompt, image: finalImage });
    alert("Added to Coloring Book!");
  };

  const generateFullBook = async () => {
    const basePrompt = prompt || "cute animals and fun scenes";
    setLoadingBook(true);
    setBookProgress(0);
    try {
      const prompts = [
        `${basePrompt} - style 1`,
        `${basePrompt} - style 2`,
        `${basePrompt} - style 3`,
        `${basePrompt} - style 4`,
        `${basePrompt} - style 5`,
      ];
      
      const results = [];
      for (let i = 0; i < prompts.length; i++) {
        setBookProgress(i + 1);
        const res = await fetch("/api/generate-coloring-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: prompts[i] }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        let imageUrlForPdf = data.image;
        // jsPDF does not support SVG data URLs, convert to PNG
        if (data.image.startsWith("data:image/svg+xml")) {
          const img = new Image();
          img.src = data.image;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const canvas = document.createElement("canvas");
          canvas.width = 1024;
          canvas.height = 1024;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 1024, 1024);
            ctx.drawImage(img, 0, 0, 1024, 1024);
            imageUrlForPdf = canvas.toDataURL("image/png");
          }
        }
        
        results.push({ prompt: prompts[i], image: imageUrlForPdf });
      }
      
      const { generateColoringBookPDF, forceDownloadPDF } = await import("@/lib/pdfGenerator");
      const pdf = generateColoringBookPDF("My Coloring Book", "Creative Artist", results);
      forceDownloadPDF(pdf, "Complete_Coloring_Book.pdf");
      
    } catch (err) {
      console.error(err);
      alert("Failed to generate complete coloring book. Please try again!");
    } finally {
      setLoadingBook(false);
      setBookProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-light/20 via-white to-candy-pink/5">
      <div className="page-container">
        {/* Header */}
        <div className="tool-header">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lavender-light/40 text-lavender-deep text-sm font-heading font-bold mb-4">
            <Palette className="w-4 h-4" />
            Coloring Page Creator
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-3">
            AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-medium to-lavender-deep">
              Coloring Pages
            </span>{" "}
            🎨
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Type anything your child can imagine and get a printable coloring page outline!
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="card-playful space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your coloring page... (e.g., cute baby dragon eating ice cream)"
                className="input-playful flex-1"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
              <button
                onClick={() => generate()}
                disabled={loading || loadingBook || !prompt.trim()}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Create Single Page
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={generateFullBook}
              disabled={loading || loadingBook}
              className="btn-secondary w-full border-lavender-medium text-lavender-deep hover:bg-lavender-light/10 disabled:opacity-50"
            >
              {loadingBook ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Creating Book ({bookProgress}/5)...
                </>
              ) : (
                <>
                  <Library className="w-5 h-5 inline mr-2" />
                  Generate Complete 5-Page Coloring Book
                </>
              )}
            </button>

            {/* Preset Chips */}
            <div>
              <p className="text-xs text-gray-400 font-heading font-semibold mb-2">
                Quick picks:
              </p>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPrompt(p.prompt);
                      generate(p.prompt);
                    }}
                    disabled={loading}
                    className="chip-default hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="max-w-3xl mx-auto">
          {!result && !loading && (
            <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="text-6xl mb-4 animate-float">🎨</div>
              <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                Your coloring page will appear here
              </h3>
              <p className="text-gray-400 text-sm">
                Describe something fun or pick a preset above!
              </p>
            </div>
          )}

          {loading && (
            <div className="card-playful flex flex-col items-center justify-center min-h-[400px] text-center">
              <Loader2 className="w-12 h-12 text-lavender-medium animate-spin mb-4" />
              <h3 className="font-heading font-bold text-xl text-gray-700 mb-2">
                Drawing your coloring page...
              </h3>
              <p className="text-gray-400 text-sm">
                Our AI artist is sketching the outlines! 🖌️
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              {/* Image Card */}
              <div className="card-playful overflow-hidden p-0">
                <div className="bg-gradient-to-r from-lavender-medium to-lavender-deep p-4">
                  <div className="flex items-center gap-2 text-white">
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-heading font-bold">Your Coloring Page</span>
                    {result.isMock && (
                      <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        Demo Mode
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-center">
                  <InteractiveCanvas ref={canvasRef} imageUrl={result.image} />
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center font-medium">
                    &ldquo;{result.prompt}&rdquo;
                  </p>
                  {result.isMock && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <p className="text-xs text-yellow-800 text-center">
                        <strong>Demo Mode Active:</strong> You are seeing a pre-made placeholder illustration. To generate custom images like "{result.prompt}", please add an OpenAI API key to your <code>.env.local</code> file!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button onClick={handleAddToBook} className="btn-primary flex-1 bg-gradient-to-r from-lavender-medium to-lavender-deep text-white border-0 hover:from-lavender-deep hover:to-lavender-dark min-w-[140px]">
                  <Library className="w-4 h-4" /> Add to Book
                </button>
                <button onClick={downloadPDF} className="btn-secondary flex-1 min-w-[140px]">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button onClick={printPage} className="btn-secondary flex-1 min-w-[140px]">
                  <Printer className="w-4 h-4" /> Print Instantly
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEO & Educational Content */}
        <div className="mt-16 max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Create Your Own Magical Coloring Pages</h2>
            <p className="text-gray-600 font-body leading-relaxed mb-4">
              Unleash your child's imagination with our free AI-powered coloring page generator! Instead of endlessly searching for the perfect coloring book, you can simply type in exactly what your child wants to color—like a "friendly dinosaur eating ice cream" or a "magical unicorn in a forest." Our AI will instantly draw a custom, high-quality black-and-white outline.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Digital Canvas or Printable PDF</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Once generated, kids can use our <strong>interactive digital canvas</strong> to paint right on the screen using vibrant colors, adjustable brush sizes, and an eraser. The clever blending technology ensures their colors stay perfectly behind the black outlines. If you prefer screen-free time, you can instantly download the image as a PDF or send it straight to your printer!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">Why Coloring is Important for Kids</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-bold text-gray-800">Motor Skills & Hand-Eye Coordination</h3>
                <p className="text-gray-600 text-sm mt-1">Holding crayons and painting carefully within lines helps develop the crucial fine motor skills needed for handwriting and typing.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">Color Recognition & Creativity</h3>
                <p className="text-gray-600 text-sm mt-1">Coloring allows kids to experiment with color combinations and express their emotions visually without the pressure of drawing from scratch.</p>
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-800">Focus & Stress Relief</h3>
                <p className="text-gray-600 text-sm mt-1">Coloring has a therapeutic, calming effect on children. It teaches patience, focus, and mindfulness in a fun, accessible way.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="coloring-bottom" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
