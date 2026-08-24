import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/openai";

// A simple SVG coloring page generator for mock mode
function generateMockColoringPage(prompt: string): string {
  const designs: Record<string, string> = {
    animals: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="white"/>
      <!-- Cat body -->
      <ellipse cx="512" cy="600" rx="180" ry="200" fill="none" stroke="black" stroke-width="6"/>
      <!-- Cat head -->
      <circle cx="512" cy="350" r="130" fill="none" stroke="black" stroke-width="6"/>
      <!-- Ears -->
      <polygon points="420,260 380,160 460,220" fill="none" stroke="black" stroke-width="5"/>
      <polygon points="600,260 640,160 560,220" fill="none" stroke="black" stroke-width="5"/>
      <!-- Eyes -->
      <ellipse cx="470" cy="330" rx="25" ry="30" fill="none" stroke="black" stroke-width="4"/>
      <ellipse cx="555" cy="330" rx="25" ry="30" fill="none" stroke="black" stroke-width="4"/>
      <!-- Nose -->
      <polygon points="512,370 500,390 524,390" fill="none" stroke="black" stroke-width="4"/>
      <!-- Mouth -->
      <path d="M500,390 Q512,410 524,390" fill="none" stroke="black" stroke-width="3"/>
      <!-- Whiskers -->
      <line x1="380" y1="370" x2="460" y2="380" stroke="black" stroke-width="3"/>
      <line x1="380" y1="390" x2="460" y2="390" stroke="black" stroke-width="3"/>
      <line x1="560" y1="380" x2="640" y2="370" stroke="black" stroke-width="3"/>
      <line x1="560" y1="390" x2="640" y2="390" stroke="black" stroke-width="3"/>
      <!-- Tail -->
      <path d="M690,550 Q780,450 750,350" fill="none" stroke="black" stroke-width="5"/>
      <!-- Paws -->
      <ellipse cx="420" cy="780" rx="45" ry="30" fill="none" stroke="black" stroke-width="4"/>
      <ellipse cx="600" cy="780" rx="45" ry="30" fill="none" stroke="black" stroke-width="4"/>
      <!-- Stars decoration -->
      <polygon points="200,100 210,130 240,130 215,150 225,180 200,160 175,180 185,150 160,130 190,130" fill="none" stroke="black" stroke-width="3"/>
      <polygon points="820,150 830,175 855,175 835,190 843,215 820,200 797,215 805,190 785,175 810,175" fill="none" stroke="black" stroke-width="3"/>
      <text x="512" y="900" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ccc">Color Me!</text>
    </svg>`,
    vehicles: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="white"/>
      <!-- Rocket body -->
      <path d="M512,150 Q580,300 580,550 L512,600 L444,550 Q444,300 512,150" fill="none" stroke="black" stroke-width="6"/>
      <!-- Nose cone -->
      <path d="M480,200 L512,130 L544,200" fill="none" stroke="black" stroke-width="5"/>
      <!-- Windows -->
      <circle cx="512" cy="300" r="35" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="512" cy="400" r="25" fill="none" stroke="black" stroke-width="4"/>
      <!-- Fins -->
      <path d="M444,500 L380,600 L444,560" fill="none" stroke="black" stroke-width="5"/>
      <path d="M580,500 L644,600 L580,560" fill="none" stroke="black" stroke-width="5"/>
      <!-- Flames -->
      <path d="M470,600 Q490,700 512,750 Q534,700 554,600" fill="none" stroke="black" stroke-width="4"/>
      <path d="M485,620 Q500,690 512,720 Q524,690 539,620" fill="none" stroke="black" stroke-width="3"/>
      <!-- Stars -->
      <circle cx="200" cy="300" r="8" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="800" cy="200" r="12" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="150" cy="500" r="6" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="850" cy="450" r="10" fill="none" stroke="black" stroke-width="3"/>
      <!-- Planet -->
      <circle cx="780" cy="700" r="60" fill="none" stroke="black" stroke-width="5"/>
      <ellipse cx="780" cy="700" rx="90" ry="20" fill="none" stroke="black" stroke-width="3"/>
      <text x="512" y="900" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ccc">Color Me!</text>
    </svg>`,
    superheroes: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="white"/>
      <!-- Head -->
      <circle cx="512" cy="250" r="80" fill="none" stroke="black" stroke-width="6"/>
      <!-- Mask -->
      <path d="M450,230 Q512,210 574,230 Q574,260 512,250 Q450,260 450,230" fill="none" stroke="black" stroke-width="4"/>
      <!-- Eyes -->
      <ellipse cx="485" cy="245" rx="15" ry="10" fill="none" stroke="black" stroke-width="3"/>
      <ellipse cx="540" cy="245" rx="15" ry="10" fill="none" stroke="black" stroke-width="3"/>
      <!-- Smile -->
      <path d="M490,280 Q512,300 534,280" fill="none" stroke="black" stroke-width="3"/>
      <!-- Body -->
      <path d="M460,330 L430,550 L500,550 L512,580 L524,550 L594,550 L564,330" fill="none" stroke="black" stroke-width="5"/>
      <!-- Cape -->
      <path d="M460,330 Q380,450 350,650" fill="none" stroke="black" stroke-width="5"/>
      <path d="M564,330 Q644,450 674,650" fill="none" stroke="black" stroke-width="5"/>
      <path d="M350,650 Q512,600 674,650" fill="none" stroke="black" stroke-width="4"/>
      <!-- Star emblem -->
      <polygon points="512,400 520,420 542,420 524,434 530,455 512,442 494,455 500,434 482,420 504,420" fill="none" stroke="black" stroke-width="3"/>
      <!-- Arms -->
      <path d="M430,370 L340,340 L310,300" fill="none" stroke="black" stroke-width="5"/>
      <path d="M594,370 L684,340 L714,300" fill="none" stroke="black" stroke-width="5"/>
      <!-- Fists -->
      <circle cx="300" cy="290" r="20" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="724" cy="290" r="20" fill="none" stroke="black" stroke-width="4"/>
      <!-- Legs -->
      <line x1="480" y1="550" x2="450" y2="750" stroke="black" stroke-width="5"/>
      <line x1="544" y1="550" x2="574" y2="750" stroke="black" stroke-width="5"/>
      <!-- Boots -->
      <ellipse cx="440" cy="760" rx="35" ry="18" fill="none" stroke="black" stroke-width="4"/>
      <ellipse cx="584" cy="760" rx="35" ry="18" fill="none" stroke="black" stroke-width="4"/>
      <!-- Action lines -->
      <line x1="180" y1="200" x2="220" y2="220" stroke="black" stroke-width="3"/>
      <line x1="160" y1="250" x2="200" y2="250" stroke="black" stroke-width="3"/>
      <line x1="800" y1="200" x2="760" y2="220" stroke="black" stroke-width="3"/>
      <line x1="820" y1="250" x2="780" y2="250" stroke="black" stroke-width="3"/>
      <text x="512" y="900" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ccc">Color Me!</text>
    </svg>`,
    space: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="white"/>
      <!-- Planet -->
      <circle cx="512" cy="400" r="200" fill="none" stroke="black" stroke-width="6"/>
      <!-- Ring -->
      <ellipse cx="512" cy="400" rx="320" ry="60" fill="none" stroke="black" stroke-width="5"/>
      <!-- Craters -->
      <circle cx="460" cy="350" r="30" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="560" cy="430" r="20" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="490" cy="480" r="25" fill="none" stroke="black" stroke-width="3"/>
      <!-- Stars -->
      <polygon points="150,150 160,175 185,175 165,190 172,215 150,200 128,215 135,190 115,175 140,175" fill="none" stroke="black" stroke-width="3"/>
      <polygon points="850,100 858,120 880,120 863,133 869,155 850,142 831,155 837,133 820,120 842,120" fill="none" stroke="black" stroke-width="3"/>
      <polygon points="100,600 108,620 130,620 113,633 119,655 100,642 81,655 87,633 70,620 92,620" fill="none" stroke="black" stroke-width="3"/>
      <polygon points="900,500 906,515 922,515 910,525 914,540 900,530 886,540 890,525 878,515 894,515" fill="none" stroke="black" stroke-width="3"/>
      <!-- Small stars -->
      <circle cx="300" cy="200" r="4" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="700" cy="300" r="5" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="200" cy="450" r="3" fill="none" stroke="black" stroke-width="3"/>
      <circle cx="800" cy="600" r="4" fill="none" stroke="black" stroke-width="3"/>
      <!-- UFO -->
      <ellipse cx="300" cy="750" rx="80" ry="25" fill="none" stroke="black" stroke-width="4"/>
      <path d="M260,750 Q300,700 340,750" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="300" cy="720" r="10" fill="none" stroke="black" stroke-width="3"/>
      <!-- Comet -->
      <circle cx="750" cy="180" r="15" fill="none" stroke="black" stroke-width="4"/>
      <path d="M740,190 Q680,220 620,280" fill="none" stroke="black" stroke-width="3"/>
      <path d="M735,195 Q690,230 640,300" fill="none" stroke="black" stroke-width="2"/>
      <text x="512" y="920" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ccc">Color Me!</text>
    </svg>`,
    dinosaurs: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="white"/>
      <!-- Dinosaur Body -->
      <path d="M300,700 Q300,500 500,500 Q700,500 700,700 Q700,800 600,800 Q500,800 500,700 Q400,750 300,700" fill="none" stroke="black" stroke-width="6"/>
      <!-- Dinosaur Head -->
      <circle cx="650" cy="400" r="80" fill="none" stroke="black" stroke-width="6"/>
      <!-- Dinosaur Neck -->
      <path d="M550,550 Q600,450 600,450 L700,450 Q650,550 650,550" fill="none" stroke="black" stroke-width="6"/>
      <!-- Face -->
      <circle cx="670" cy="380" r="10" fill="none" stroke="black" stroke-width="4"/>
      <path d="M680,430 Q700,450 720,430" fill="none" stroke="black" stroke-width="4"/>
      <!-- Spikes -->
      <polygon points="450,500 480,450 510,500" fill="none" stroke="black" stroke-width="5"/>
      <polygon points="350,550 380,500 410,550" fill="none" stroke="black" stroke-width="5"/>
      <polygon points="250,650 280,600 310,650" fill="none" stroke="black" stroke-width="5"/>
      <text x="512" y="900" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ccc">Color Me!</text>
    </svg>`,
    underwater: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill="white"/>
      <!-- Fish Body -->
      <ellipse cx="512" cy="512" rx="150" ry="100" fill="none" stroke="black" stroke-width="6"/>
      <!-- Fish Tail -->
      <polygon points="362,512 250,450 250,574" fill="none" stroke="black" stroke-width="6"/>
      <!-- Fish Eye -->
      <circle cx="600" cy="480" r="15" fill="none" stroke="black" stroke-width="4"/>
      <!-- Fish Smile -->
      <path d="M620,530 Q630,550 650,530" fill="none" stroke="black" stroke-width="4"/>
      <!-- Bubbles -->
      <circle cx="700" cy="400" r="20" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="720" cy="330" r="15" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="750" cy="270" r="10" fill="none" stroke="black" stroke-width="4"/>
      <!-- Seaweed -->
      <path d="M200,900 Q250,750 200,600 Q150,450 200,300" fill="none" stroke="black" stroke-width="6"/>
      <path d="M800,900 Q750,750 800,600 Q850,450 800,300" fill="none" stroke="black" stroke-width="6"/>
      <text x="512" y="900" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#ccc">Color Me!</text>
    </svg>`,
  };

  // Determine which design to use based on prompt keywords
  const lowerPrompt = prompt.toLowerCase();
  let selectedDesign = designs.animals; // default

  if (lowerPrompt.includes("rocket") || lowerPrompt.includes("car") || lowerPrompt.includes("truck") || lowerPrompt.includes("vehicle") || lowerPrompt.includes("train")) {
    selectedDesign = designs.vehicles;
  } else if (lowerPrompt.includes("hero") || lowerPrompt.includes("super") || lowerPrompt.includes("power")) {
    selectedDesign = designs.superheroes;
  } else if (lowerPrompt.includes("space") || lowerPrompt.includes("planet") || lowerPrompt.includes("star") || lowerPrompt.includes("alien") || lowerPrompt.includes("ufo")) {
    selectedDesign = designs.space;
  } else if (lowerPrompt.includes("dino") || lowerPrompt.includes("t-rex") || lowerPrompt.includes("jurassic")) {
    selectedDesign = designs.dinosaurs;
  } else if (lowerPrompt.includes("fish") || lowerPrompt.includes("water") || lowerPrompt.includes("ocean") || lowerPrompt.includes("sea") || lowerPrompt.includes("coral")) {
    selectedDesign = designs.underwater;
  }

  // Convert SVG to data URL
  const customText = prompt.length > 20 ? `${prompt.substring(0, 20)}...` : prompt;
  const svgWithPrompt = selectedDesign.replace('Color Me!', `Color: ${customText}`);
  const base64 = Buffer.from(svgWithPrompt).toString("base64");
  return base64;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    const enhancedPrompt = `${prompt}, black and white thick line art, coloring book page outline for children, zero shading, pure white background, simple clear outlines, no gray tones, suitable for kids to color`;

    try {
      const imageBase64 = await generateImage(enhancedPrompt, "1024x1024");
      return NextResponse.json({
        image: `data:image/png;base64,${imageBase64}`,
        prompt: prompt,
        isMock: false,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        const svgBase64 = generateMockColoringPage(prompt);
        return NextResponse.json({
          image: `data:image/svg+xml;base64,${svgBase64}`,
          prompt: prompt,
          isMock: true,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Coloring page error:", error);
    return NextResponse.json(
      { error: "Failed to generate coloring page" },
      { status: 500 }
    );
  }
}
