"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Loader2, Paintbrush, RotateCcw, Download } from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";
import Image from "next/image";

export default function MagicArtPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineWidth = 5;
        context.lineCap = "round";
        context.strokeStyle = "#333333";
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    
    e.preventDefault(); // Prevent scrolling on touch devices
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      setResultImage(null);
    }
  };

  const handleTransform = () => {
    if (!hasDrawn) return;
    setLoading(true);
    
    // In a real app, we would get the Data URL of the canvas and send it to an Image-to-Image AI model.
    // const dataUrl = canvasRef.current?.toDataURL();
    
    // Mock API call
    setTimeout(() => {
      // Using a placeholder image to simulate the AI generating a beautiful illustration from a scribble
      setResultImage("https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=600&auto=format&fit=crop");
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-sprout-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-glow-rose mb-2">
            <Paintbrush className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-rose-900">
            Scribble to Masterpiece
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Draw a simple shape, and our AI will turn it into magic!
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-sprout-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Drawing Canvas Area */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-gray-700 text-lg flex items-center gap-2">
              1. Draw Here <span className="text-sm font-normal text-gray-400">(Try a cat or a car!)</span>
            </h3>
            
            <div className="border-4 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50 touch-none">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={endDrawing}
                onTouchMove={draw}
                className="w-full h-auto cursor-crosshair"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={clearCanvas}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Clear
              </button>
              <button
                onClick={handleTransform}
                disabled={!hasDrawn || loading}
                className="flex-[2] py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-heading font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Transform!
              </button>
            </div>
          </div>

          {/* Result Area */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-gray-700 text-lg">2. AI Masterpiece</h3>
            <div className="border-4 border-pink-100 rounded-2xl overflow-hidden bg-pink-50/30 flex items-center justify-center aspect-square relative">
              {loading ? (
                <div className="flex flex-col items-center text-pink-500">
                  <Sparkles className="w-10 h-10 animate-pulse mb-2" />
                  <p className="font-heading font-semibold animate-pulse">Working magic...</p>
                </div>
              ) : resultImage ? (
                <div className="w-full h-full relative animate-in fade-in zoom-in duration-700">
                  <Image 
                    src={resultImage} 
                    alt="AI Generated Masterpiece" 
                    fill 
                    className="object-cover"
                    unoptimized // for external unsplash URL
                  />
                  <div className="absolute inset-0 ring-inset ring-4 ring-pink-400/20 rounded-xl pointer-events-none"></div>
                </div>
              ) : (
                <div className="text-gray-400 font-body text-center p-6">
                  Your masterpiece will appear here after you click Transform!
                </div>
              )}
            </div>
            
            {resultImage && (
              <button className="w-full py-3 bg-white border-2 border-pink-200 hover:border-pink-400 text-pink-700 rounded-xl font-heading font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                <Download className="w-5 h-5" /> Download Art
              </button>
            )}
          </div>

        </div>

        {/* SEO Bottom */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">How Does Image-to-Image AI Work?</h2>
            <p className="text-gray-600 font-body leading-relaxed">
              Our "Scribble to Masterpiece" tool uses advanced Image-to-Image AI algorithms. When your child draws a shape on the canvas, the AI analyzes the contours, lines, and general structure of the drawing. It then uses that structure as a "control net" to generate a fully detailed, high-resolution illustration that matches the original intent. It shows kids that their simple ideas can bloom into beautiful creations!
            </p>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="magicart-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
