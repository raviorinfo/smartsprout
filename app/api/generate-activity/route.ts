import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/openai";

interface Activity {
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  safetyWarnings: string[];
  timeEstimate: string;
  funFact: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    title: "🌋 Baking Soda Volcano",
    description:
      "Build an erupting volcano right at home! This classic science experiment teaches kids about chemical reactions in the most exciting way possible.",
    materials: [
      "Baking soda (3 tablespoons)",
      "Vinegar (1/2 cup)",
      "Dish soap (a squirt)",
      "Food coloring (red or orange)",
      "A cup or small bottle",
      "A tray or plate to catch the mess",
    ],
    steps: [
      "Place the cup or bottle in the center of the tray.",
      "Add 3 tablespoons of baking soda to the cup.",
      "Add a squirt of dish soap for extra foamy bubbles.",
      "Add a few drops of red or orange food coloring.",
      "When you're ready for the eruption, pour in the vinegar and watch it fizz!",
      "Observe the chemical reaction — the fizz is carbon dioxide gas!",
    ],
    safetyWarnings: [
      "Adult supervision recommended",
      "Do this activity on a tray or outside — it can get messy!",
      "Don't taste or drink any of the materials",
    ],
    timeEstimate: "15 minutes",
    funFact:
      "Real volcanoes erupt because of pressure from hot gases underground — kind of like the gas your mini-volcano makes!",
  },
  {
    title: "🎭 Cardboard Puppet Theater",
    description:
      "Create your own puppet theater and put on a show! This creative craft encourages storytelling and imagination.",
    materials: [
      "A large cardboard box",
      "Scissors (ask a grown-up to help!)",
      "Markers and crayons",
      "Paper bags or socks for puppets",
      "Glue stick",
      "String (optional for curtain)",
    ],
    steps: [
      "Ask an adult to cut a large rectangle window in one side of the box for the stage.",
      "Decorate the box with markers — add curtains, stars, and a theater name!",
      "Make puppets from paper bags or socks — draw faces and add paper accessories.",
      "Create simple puppet characters: a hero, a funny friend, and a silly villain.",
      "Practice your puppet show with a simple story.",
      "Invite your family to watch your puppet performance!",
    ],
    safetyWarnings: [
      "An adult should handle scissors and cutting the cardboard",
      "Be careful with sharp edges on cut cardboard",
    ],
    timeEstimate: "45 minutes",
    funFact:
      "Puppet shows have been around for over 3,000 years! Ancient Egyptians and Greeks loved them too!",
  },
  {
    title: "🎨 Secret Message Painting",
    description:
      "Write invisible messages and reveal them with watercolor magic! This art-meets-science activity is full of surprises.",
    materials: [
      "White paper",
      "White crayon or white candle",
      "Watercolor paints",
      "A paintbrush",
      "Water cup",
      "Markers (optional for decoration)",
    ],
    steps: [
      "Use the white crayon or candle to write a secret message or draw a picture on white paper.",
      "Press hard so the wax sticks to the paper (you won't be able to see it yet!).",
      "Dip your paintbrush in watercolor paint — pick a bright color!",
      "Paint over the entire paper with broad brush strokes.",
      "Watch your secret message magically appear! The wax resists the paint.",
      "Try different color combos and messages for more fun!",
    ],
    safetyWarnings: [
      "Cover the table with newspaper to avoid paint stains",
      "Wash hands after painting",
      "Wear an old shirt or smock",
    ],
    timeEstimate: "20 minutes",
    funFact:
      "This works because of a technique called 'wax resist' — the waxy crayon repels the water-based paint!",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplies, age, timeLimit } = body;

    if (!supplies || !age) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a creative children's activity expert. Generate fun, safe, screen-free activities for kids.

RULES:
- Activities must be safe for a ${age}-year-old child
- Use ONLY these available supplies: ${supplies.join(", ")}
- Time limit: ${timeLimit || "30 minutes"}
- Generate exactly 3 different activities
- Include clear step-by-step instructions
- ALWAYS include safety warnings where applicable
- Make activities educational and fun
- Include a fun fact about each activity

RESPOND ONLY with valid JSON:
{
  "activities": [
    {
      "title": "Activity Title with Emoji",
      "description": "Brief exciting description",
      "materials": ["item 1", "item 2"],
      "steps": ["Step 1 instruction", "Step 2 instruction"],
      "safetyWarnings": ["Warning 1"],
      "timeEstimate": "20 minutes",
      "funFact": "An interesting educational fact"
    }
  ]
}`;

    const userPrompt = `Generate 3 screen-free activities for a ${age}-year-old using these supplies: ${supplies.join(", ")}. Time limit: ${timeLimit || "30 minutes"}. Make them creative and educational!`;

    try {
      const result = await generateChatCompletion(systemPrompt, userPrompt, 2500);
      const data = JSON.parse(result);
      return NextResponse.json(data);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        return NextResponse.json({ activities: MOCK_ACTIVITIES });
      }
      throw error;
    }
  } catch (error) {
    console.error("Activity generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate activities" },
      { status: 500 }
    );
  }
}
