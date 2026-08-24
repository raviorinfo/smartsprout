"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Eraser, Trash2 } from "lucide-react";

interface InteractiveCanvasProps {
  imageUrl: string;
}

export interface InteractiveCanvasRef {
  getCombinedImage: () => Promise<string>;
}

const InteractiveCanvas = forwardRef<InteractiveCanvasRef, InteractiveCanvasProps>(({ imageUrl }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3B82F6");
  const [brushSize, setBrushSize] = useState(15);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    "#EF4444", "#F97316", "#F59E0B", "#10B981", 
    "#3B82F6", "#8B5CF6", "#EC4899", "#A8A29E", "#000000"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Use a fixed resolution for the internal canvas to ensure high quality exports
    // and consistent brush sizes, regardless of CSS display size.
    canvas.width = 1024;
    canvas.height = 1024;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [imageUrl]); // Re-init when a new image is loaded

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Map screen coordinates to internal canvas resolution (1024x1024)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    // Only prevent default on touch to allow scrolling on mobile when not interacting with canvas
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = isEraser ? "#ffffff" : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useImperativeHandle(ref, () => ({
    getCombinedImage: async () => {
      const canvas = canvasRef.current;
      if (!canvas) return imageUrl;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return imageUrl;

      // 1. Draw the user's coloring layer
      ctx.drawImage(canvas, 0, 0);

      // 2. Draw the outline image on top with multiply
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      let loadUrl = imageUrl;
      // Convert SVG data URL to Object URL if needed to avoid taint issues
      if (imageUrl.startsWith('data:image/svg+xml')) {
         const blob = new Blob([decodeURIComponent(imageUrl.replace('data:image/svg+xml,', ''))], { type: 'image/svg+xml' });
         loadUrl = URL.createObjectURL(blob);
      }
      
      img.src = loadUrl;
      await new Promise((resolve, reject) => { 
        img.onload = resolve; 
        img.onerror = reject;
      });
      
      ctx.globalCompositeOperation = "multiply";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (imageUrl.startsWith('data:image/svg+xml')) {
         URL.revokeObjectURL(loadUrl);
      }

      return tempCanvas.toDataURL("image/png", 0.9);
    }
  }));

  return (
    <div className="flex flex-col gap-4 animate-fade-in w-full max-w-2xl mx-auto">
      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-playful-lg border-4 border-white bg-white cursor-crosshair touch-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
        {/* Outline layer with multiply blend mode */}
        <img
          src={imageUrl}
          alt="Coloring outline"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
          draggable={false}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between bg-white p-4 rounded-3xl shadow-playful border border-gray-100 gap-4">
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-10 h-10 rounded-full shadow-sm border-2 transition-transform ${color === c && !isEraser ? 'scale-110 border-gray-400' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex flex-col gap-1 flex-1 max-w-[150px]">
            <label className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">Brush Size</label>
            <input
              type="range"
              min="5"
              max="60"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>
          <button
            onClick={() => setIsEraser(true)}
            className={`p-3 rounded-xl transition-colors ${isEraser ? 'bg-sky-100 text-sky-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1"></div>
          <button
            onClick={clearCanvas}
            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

InteractiveCanvas.displayName = "InteractiveCanvas";

export default InteractiveCanvas;
