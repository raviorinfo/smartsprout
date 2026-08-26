import { NextRequest, NextResponse } from "next/server";
import { generateImage, analyzeImage } from "@/lib/openai";
import { checkRateLimit, getClientId } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const { allowed, remaining } = checkRateLimit(getClientId(request), { maxRequests: 10, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment and try again!" }, { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } });
    }

    const body = await request.json();
    const { drawingDataUrl, description, mode } = body;

    if (!drawingDataUrl) {
      return NextResponse.json(
        { error: "Missing drawing data" },
        { status: 400 }
      );
    }

    let artPrompt = "";

    if (mode === "camera") {
      // Use Vision API to analyze the camera photo and generate a description
      const visionPrompt = "You are looking at a child's physical drawing on paper. Analyze the drawing and describe what it is in 1-2 short, enthusiastic sentences. Then, generate a very detailed DALL-E image prompt that transforms their drawing into a beautiful, vibrant, high-quality children's book illustration. Focus on capturing the essence of what they drew but making it magical. Output ONLY the detailed DALL-E prompt.";
      
      try {
        const generatedPrompt = await analyzeImage(visionPrompt, drawingDataUrl);
        artPrompt = `A beautiful, vibrant, colorful children's illustration: ${generatedPrompt}. Whimsical art style, bright saturated colors, cute and friendly, highly detailed digital art, magical sparkles, safe for children.`;
      } catch (err) {
        // Fallback if vision fails
        console.error("Vision API failed:", err);
        artPrompt = `A beautiful, vibrant, colorful children's illustration of ${description || "a magical creature"}. Whimsical art style, bright saturated colors, cute and friendly, highly detailed digital art, children's book illustration quality, magical sparkles and glow effects. Safe for children.`;
      }
    } else {
      // Standard canvas drawing
      artPrompt = `A beautiful, vibrant, colorful children's illustration of ${description || "a magical creature"}. Whimsical art style, bright saturated colors, smooth gradients, cute and friendly, highly detailed digital art, children's book illustration quality, magical sparkles and glow effects, warm lighting, cheerful and joyful mood. Safe for children.`;
    }

    try {
      const imageBase64 = await generateImage(artPrompt, "1024x1024");
      return NextResponse.json({
        image: `data:image/png;base64,${imageBase64}`,
        isMock: false,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        // Generate a colorful SVG art piece as mock output
        const mockSvg = generateMockArt(description || "magic");
        const base64 = Buffer.from(mockSvg).toString("base64");
        return NextResponse.json({
          image: `data:image/svg+xml;base64,${base64}`,
          isMock: true,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Magic Art generation error:", error);
    return NextResponse.json(
      { error: "Failed to transform your art. Please try again!" },
      { status: 500 }
    );
  }
}

function generateMockArt(description: string): string {
  const colors = [
    ["#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1", "#96CEB4"],
    ["#E8A0BF", "#BA90C6", "#C0DBEA", "#FDF4F5", "#7FB5FF"],
    ["#FFB4B4", "#FFDEB4", "#B4FFD3", "#B4D4FF", "#E8B4FF"],
    ["#FF9A9E", "#FAD0C4", "#A8E6CF", "#DCEDC1", "#FFD3B6"],
  ];

  const palette = colors[Math.floor(Math.random() * colors.length)];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="${palette[0]}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${palette[1]}" stop-opacity="0.6"/>
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="white" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
    </defs>
    
    <!-- Background -->
    <rect width="1024" height="1024" fill="url(#bg)"/>
    <rect width="1024" height="1024" fill="${palette[4]}" opacity="0.2"/>
    
    <!-- Large decorative circles -->
    <circle cx="512" cy="450" r="200" fill="${palette[0]}" opacity="0.4"/>
    <circle cx="350" cy="500" r="150" fill="${palette[1]}" opacity="0.35"/>
    <circle cx="674" cy="500" r="150" fill="${palette[2]}" opacity="0.35"/>
    <circle cx="512" cy="350" r="120" fill="${palette[3]}" opacity="0.4"/>
    
    <!-- Central flower/star shape -->
    <g transform="translate(512,450)">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => 
        `<ellipse cx="0" cy="-100" rx="40" ry="80" fill="${palette[i % palette.length]}" opacity="0.6" transform="rotate(${angle})"/>`
      ).join('\n      ')}
      <circle cx="0" cy="0" r="60" fill="${palette[3]}" opacity="0.8"/>
      <circle cx="0" cy="0" r="40" fill="white" opacity="0.5"/>
    </g>
    
    <!-- Sparkles -->
    ${Array.from({length: 20}, (_, i) => {
      const x = 100 + Math.floor(Math.random() * 824);
      const y = 100 + Math.floor(Math.random() * 824);
      const size = 3 + Math.floor(Math.random() * 8);
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${0.3 + Math.random() * 0.5}"/>`;
    }).join('\n    ')}
    
    <!-- Decorative stars -->
    ${[{x: 200, y: 150}, {x: 800, y: 200}, {x: 150, y: 700}, {x: 850, y: 650}, {x: 500, y: 100}].map(({x, y}) => 
      `<polygon points="${x},${y-20} ${x+6},${y-6} ${x+20},${y} ${x+6},${y+6} ${x},${y+20} ${x-6},${y+6} ${x-20},${y} ${x-6},${y-6}" fill="${palette[Math.floor(Math.random() * palette.length)]}" opacity="0.7"/>`
    ).join('\n    ')}
    
    <!-- Bottom text -->
    <text x="512" y="920" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="24" fill="${palette[0]}" font-weight="bold" opacity="0.8">✨ AI Masterpiece ✨</text>
    <text x="512" y="955" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" fill="${palette[2]}" opacity="0.6">Inspired by: ${description.length > 30 ? description.substring(0, 30) + '...' : description}</text>
  </svg>`;
}
