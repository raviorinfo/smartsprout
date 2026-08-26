"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, Loader2, Paintbrush, RotateCcw, Download, Camera, Pencil } from "lucide-react";
import AdSenseBanner from "@/components/AdSenseBanner";

type InputMode = "draw" | "camera";

export default function MagicArtPage() {
  const [mode, setMode] = useState<InputMode>("draw");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [hasInput, setHasInput] = useState(false);
  const [description, setDescription] = useState("");
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);

  // Initialize Drawing Canvas
  useEffect(() => {
    if (mode === "draw" && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.lineWidth = 5;
        context.lineCap = "round";
        context.strokeStyle = "#333333";
        // Fill white background so it's not transparent in base64
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setCtx(context);
      }
    }
  }, [mode]);

  // Handle Camera Lifecycle
  useEffect(() => {
    if (mode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Failed to access camera. Please allow camera permissions!");
      setMode("draw");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && hiddenCanvasRef.current) {
      const video = videoRef.current;
      const canvas = hiddenCanvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCameraPhoto(dataUrl);
        setHasInput(true);
      }
    }
  };

  const retakePhoto = () => {
    setCameraPhoto(null);
    setHasInput(false);
    setResultImage(null);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasInput(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    
    e.preventDefault();
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

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasInput(false);
      setResultImage(null);
    }
  };

  const handleTransform = async () => {
    if (!hasInput) return;
    setLoading(true);
    setResultImage(null);
    
    let dataUrl = "";
    if (mode === "draw") {
      dataUrl = canvasRef.current?.toDataURL("image/jpeg", 0.8) || "";
    } else if (mode === "camera" && cameraPhoto) {
      dataUrl = cameraPhoto;
    }
    
    try {
      const res = await fetch("/api/generate-magic-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drawingDataUrl: dataUrl,
          description: description.trim() || undefined,
          mode: mode
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultImage(data.image);
    } catch (err) {
      console.error("Magic art error:", err);
      alert("Failed to transform your art. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sprout-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-glow-rose mb-2">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-rose-900">
            Magic Art Studio
          </h1>
          <p className="text-lg text-gray-600 font-body">
            Draw something or snap a photo of your drawing on paper, and the AI will turn it into a masterpiece!
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-1 border border-sprout-200 inline-flex shadow-sm">
            <button
              onClick={() => { setMode("draw"); setHasInput(false); setResultImage(null); }}
              className={`px-6 py-2.5 rounded-full font-heading font-bold flex items-center gap-2 transition-all ${
                mode === "draw" ? "bg-rose-100 text-rose-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Pencil className="w-4 h-4" /> Draw Digital
            </button>
            <button
              onClick={() => { setMode("camera"); setHasInput(false); setResultImage(null); }}
              className={`px-6 py-2.5 rounded-full font-heading font-bold flex items-center gap-2 transition-all ${
                mode === "camera" ? "bg-rose-100 text-rose-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Camera className="w-4 h-4" /> Snap Photo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-sprout-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Area */}
          <div className="space-y-4 flex flex-col">
            <h3 className="font-heading font-bold text-gray-700 text-lg flex items-center gap-2">
              1. Your Drawing
            </h3>
            
            {/* Draw Mode */}
            <div className={`relative flex-1 min-h-[300px] border-4 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50 touch-none flex items-center justify-center ${mode !== "draw" ? "hidden" : ""}`}>
              <canvas
                ref={canvasRef}
                width={800}
                height={800}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={endDrawing}
                onTouchMove={draw}
                className="w-full h-full object-contain cursor-crosshair absolute inset-0"
              />
            </div>

            {/* Camera Mode */}
            <div className={`relative flex-1 min-h-[300px] border-4 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-black flex items-center justify-center ${mode !== "camera" ? "hidden" : ""}`}>
              {!cameraPhoto ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <img src={cameraPhoto} alt="Captured drawing" className="w-full h-full object-contain" />
              )}
              
              {!cameraPhoto && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button 
                    onClick={takePhoto}
                    className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    aria-label="Take Photo"
                  >
                    <div className="w-12 h-12 bg-rose-500 rounded-full"></div>
                  </button>
                </div>
              )}
              {/* Hidden canvas for capturing video frame */}
              <canvas ref={hiddenCanvasRef} className="hidden" />
            </div>

            {mode === "draw" && (
              <div>
                <label className="block text-sm font-heading font-semibold text-gray-600 mb-1.5">What did you draw? (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/20 outline-none transition-all font-body text-gray-700 text-sm"
                  placeholder="e.g. a cute cat, a rocket ship..."
                />
              </div>
            )}
            
            <div className="flex gap-4 mt-auto pt-2">
              <button
                onClick={mode === "draw" ? clearCanvas : retakePhoto}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> {mode === "draw" ? "Clear" : "Retake"}
              </button>
              <button
                onClick={handleTransform}
                disabled={!hasInput || loading}
                className="flex-[2] py-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white rounded-xl font-heading font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Make Magic!
              </button>
            </div>
          </div>

          {/* Result Area */}
          <div className="space-y-4 flex flex-col">
            <h3 className="font-heading font-bold text-gray-700 text-lg flex items-center gap-2">
              2. Magic Masterpiece
            </h3>
            
            <div className="flex-1 border-4 border-dashed border-gray-100 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px] relative">
              {loading ? (
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 bg-rose-200 rounded-full animate-ping"></div>
                    <div className="relative bg-white rounded-full p-4 shadow-sm border border-rose-100">
                      <Sparkles className="w-12 h-12 text-rose-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-rose-600 font-heading font-bold animate-pulse">Sprinkling magic dust...</p>
                  {mode === "camera" && <p className="text-xs text-rose-400 mt-1">Looking at your photo...</p>}
                </div>
              ) : resultImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={resultImage} 
                  alt="Transformed artwork" 
                  className="w-full h-full object-contain absolute inset-0 animate-in zoom-in duration-500"
                />
              ) : (
                <div className="text-center text-gray-400 font-body p-6">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Your masterpiece will appear here!</p>
                </div>
              )}
            </div>

            <button
              disabled={!resultImage || loading}
              onClick={() => {
                if (!resultImage) return;
                const link = document.createElement('a');
                link.href = resultImage;
                link.download = `kiddleaf-magic-art-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full py-3 bg-sprout-500 hover:bg-sprout-600 text-white rounded-xl font-heading font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-auto"
            >
              <Download className="w-5 h-5" /> Download Masterpiece
            </button>
          </div>
        </div>

        {/* SEO Bottom */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-sprout-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold text-sprout-800 mb-4">From Scribbles to Masterpieces with Vision AI</h2>
            <p className="text-gray-600 font-body leading-relaxed mb-4">
              Our Magic Art Studio has been upgraded! In addition to drawing digitally, your child can now draw on real paper with crayons or markers, click "Snap Photo", and hold it up to the webcam. 
            </p>
            <p className="text-gray-600 font-body leading-relaxed">
              We use state-of-the-art <strong>Vision AI</strong> to analyze the photograph and understand what the child has drawn. It then generates a highly detailed, professional illustration while keeping the essence of the original drawing intact. This bridge between physical crafts and digital art creates a truly magical experience for young minds.
            </p>
          </section>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <AdSenseBanner slot="magic-art-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
