import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/openai";

interface QuestStage {
  stage: number;
  narrative: string;
  question: string;
  correctAnswer: number;
  isComplete?: boolean;
}

interface MathQuestConfig {
  name: string;
  grade: string;
  theme: string;
  stage: number;
  score: number;
}

function generateMockQuest(config: MathQuestConfig): QuestStage {
  const { name, grade, theme, stage } = config;
  
  const themeNarratives: Record<string, Record<number, { narrative: string; question: string; answer: number }>> = {
    knights: {
      1: {
        narrative: `Sir ${name} approaches the Bridge of Trolls. A grumpy old Troll stomps out from under the bridge, blocking the path. "HALT! No one crosses my bridge without solving my riddle!" he growls, crossing his hairy arms.`,
        question: grade === "Kindergarten" ? "2 + 3" : grade === "1st Grade" ? "7 + 8" : grade === "2nd Grade" ? "14 + 19" : "25 × 4",
        answer: grade === "Kindergarten" ? 5 : grade === "1st Grade" ? 15 : grade === "2nd Grade" ? 33 : 100
      },
      2: {
        narrative: `The Troll grumbles and steps aside. Sir ${name} crosses the bridge and enters the Enchanted Forest. There, a friendly dragon is guarding a treasure chest with a magical lock. "Only a true math hero can open this lock!" the dragon says with a wink.`,
        question: grade === "Kindergarten" ? "5 - 2" : grade === "1st Grade" ? "15 - 7" : grade === "2nd Grade" ? "52 - 28" : "144 ÷ 12",
        answer: grade === "Kindergarten" ? 3 : grade === "1st Grade" ? 8 : grade === "2nd Grade" ? 24 : 12
      },
      3: {
        narrative: `The treasure chest opens revealing the legendary Star Crystal! But a flock of mischievous goblins swoops down from the trees! "Quick, ${name}, cast the Shield Spell to protect the crystal!" shouts the dragon.`,
        question: grade === "Kindergarten" ? "4 + 1" : grade === "1st Grade" ? "6 + 9" : grade === "2nd Grade" ? "7 × 6" : "156 - 89",
        answer: grade === "Kindergarten" ? 5 : grade === "1st Grade" ? 15 : grade === "2nd Grade" ? 42 : 67
      },
      4: {
        narrative: `The Shield Spell blasts the goblins away in a shower of sparkles! Sir ${name} carries the Star Crystal back to the kingdom. One final gate blocks the way to the castle. The gatekeeper announces: "Solve the King's Puzzle to enter!"`,
        question: grade === "Kindergarten" ? "3 + 3" : grade === "1st Grade" ? "12 - 5" : grade === "2nd Grade" ? "8 × 9" : "15 × 13",
        answer: grade === "Kindergarten" ? 6 : grade === "1st Grade" ? 7 : grade === "2nd Grade" ? 72 : 195
      },
    },
    space: {
      1: {
        narrative: `Captain ${name} receives an urgent transmission from Mission Control: "A meteor is heading towards the Space Station! Calculate the correct trajectory to deflect it!" The ship's computer beeps, waiting for the answer.`,
        question: grade === "Kindergarten" ? "1 + 4" : grade === "1st Grade" ? "9 + 6" : grade === "2nd Grade" ? "23 + 38" : "48 × 3",
        answer: grade === "Kindergarten" ? 5 : grade === "1st Grade" ? 15 : grade === "2nd Grade" ? 61 : 144
      },
      2: {
        narrative: `BOOM! The meteor is deflected! Captain ${name} spots a mysterious alien signal coming from Planet Zyx. To decode the message, the ship's decoder needs the correct fuel calculation.`,
        question: grade === "Kindergarten" ? "5 - 1" : grade === "1st Grade" ? "13 - 8" : grade === "2nd Grade" ? "64 - 29" : "225 ÷ 15",
        answer: grade === "Kindergarten" ? 4 : grade === "1st Grade" ? 5 : grade === "2nd Grade" ? 35 : 15
      },
      3: {
        narrative: `The alien message reads: "Welcome, friend!" Friendly aliens invite ${name} to their space party! But first, the spaceship needs to calculate the landing speed to touch down safely on Planet Zyx.`,
        question: grade === "Kindergarten" ? "2 + 2" : grade === "1st Grade" ? "8 + 7" : grade === "2nd Grade" ? "6 × 8" : "17 × 11",
        answer: grade === "Kindergarten" ? 4 : grade === "1st Grade" ? 15 : grade === "2nd Grade" ? 48 : 187
      },
      4: {
        narrative: `Perfect landing! The aliens cheer as Captain ${name} steps out. They offer a gift: a Star Map that reveals the way home. But to activate it, one final calculation is needed!`,
        question: grade === "Kindergarten" ? "3 + 2" : grade === "1st Grade" ? "11 - 4" : grade === "2nd Grade" ? "9 × 7" : "288 ÷ 16",
        answer: grade === "Kindergarten" ? 5 : grade === "1st Grade" ? 7 : grade === "2nd Grade" ? 63 : 18
      },
    },
    pirates: {
      1: {
        narrative: `Captain ${name} sets sail on the good ship "Math-Breaker"! The crew spots a message in a bottle floating nearby. To read the treasure map inside, ${name} must solve the Navigation Puzzle.`,
        question: grade === "Kindergarten" ? "3 + 1" : grade === "1st Grade" ? "8 + 5" : grade === "2nd Grade" ? "17 + 26" : "36 × 4",
        answer: grade === "Kindergarten" ? 4 : grade === "1st Grade" ? 13 : grade === "2nd Grade" ? 43 : 144
      },
      2: {
        narrative: `The map reveals Treasure Island! But a rival pirate ship appears on the horizon. ${name} needs to calculate the wind speed to outrun them and reach the island first!`,
        question: grade === "Kindergarten" ? "4 - 2" : grade === "1st Grade" ? "16 - 9" : grade === "2nd Grade" ? "45 - 18" : "196 ÷ 14",
        answer: grade === "Kindergarten" ? 2 : grade === "1st Grade" ? 7 : grade === "2nd Grade" ? 27 : 14
      },
      3: {
        narrative: `${name} reaches the island first! The treasure chest is buried under a giant X. To unlock it, ${name} must answer the riddle carved on the lock. "Solve this, and the gold is yours!"`,
        question: grade === "Kindergarten" ? "1 + 3" : grade === "1st Grade" ? "7 + 6" : grade === "2nd Grade" ? "5 × 9" : "23 × 8",
        answer: grade === "Kindergarten" ? 4 : grade === "1st Grade" ? 13 : grade === "2nd Grade" ? 45 : 184
      },
      4: {
        narrative: `CLICK! The chest opens, revealing mountains of golden coins and sparkling gems! Captain ${name} counts the treasure to share fairly with the crew. One last count and the quest is complete!`,
        question: grade === "Kindergarten" ? "2 + 3" : grade === "1st Grade" ? "14 - 6" : grade === "2nd Grade" ? "8 × 8" : "12 × 15",
        answer: grade === "Kindergarten" ? 5 : grade === "1st Grade" ? 8 : grade === "2nd Grade" ? 64 : 180
      },
    }
  };

  // Completion stage
  if (stage > 4) {
    const endings: Record<string, string> = {
      knights: `The gates swing open with a mighty CREAK! The entire kingdom cheers as Sir ${name} triumphantly returns the Star Crystal to its rightful place. The King places a crown of stars on ${name}'s head and declares: "You are the bravest, smartest knight in all the land!" 🏰👑`,
      space: `Captain ${name} activates the Star Map, and the spaceship warps through a tunnel of rainbow light, arriving safely back at Earth! Mission Control erupts in applause. "The greatest space captain in the galaxy!" they announce. ${name} looks up at the stars, already dreaming of the next adventure! 🚀⭐`,
      pirates: `Captain ${name} divides the treasure equally among the crew — that's what the best pirates do! The crew cheers: "Three cheers for Captain ${name}, the smartest pirate on the seven seas!" They set sail for home under a cotton-candy sunset, ready for more adventures! 🏴‍☠️💰`,
    };

    return {
      stage: stage,
      narrative: endings[theme] || endings.knights,
      question: "",
      correctAnswer: 0,
      isComplete: true
    };
  }

  const themeData = themeNarratives[theme] || themeNarratives.knights;
  const stageData = themeData[stage] || themeData[1];
  
  return {
    stage,
    narrative: stageData.narrative,
    question: stageData.question,
    correctAnswer: stageData.answer
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, grade, theme, stage, score } = body;

    if (!name || !grade || !theme) {
      return NextResponse.json(
        { error: "Missing required fields: name, grade, theme" },
        { status: 400 }
      );
    }

    const currentStage = stage || 1;

    // Completion check
    if (currentStage > 4) {
      const mock = generateMockQuest({ name, grade, theme, stage: currentStage, score: score || 0 });
      return NextResponse.json(mock);
    }

    const systemPrompt = `You are a gamified math quest generator for children. Create an exciting adventure narrative with an embedded math problem.

RULES:
- Hero's name: "${name}"
- Grade level: ${grade}
- Theme: ${theme === "knights" ? "Knights & Dragons medieval fantasy" : theme === "space" ? "Space Explorers sci-fi" : "Pirate Treasure nautical adventure"}
- Current stage: ${currentStage} of 4
- Generate age-appropriate math problems for ${grade}
- The narrative should be 2-3 exciting sentences that set up the math problem naturally
- The math problem should feel like part of the story
- NEVER include anything scary or violent — keep it playful and heroic

${currentStage > 4 ? "This is the VICTORY stage. Write a triumphant ending. Set isComplete to true, question to empty string, correctAnswer to 0." : ""}

RESPOND ONLY with valid JSON:
{
  "stage": ${currentStage},
  "narrative": "The adventure narrative text here",
  "question": "The math problem as a string (e.g. '7 + 8')",
  "correctAnswer": 15,
  "isComplete": false
}`;

    const userPrompt = `Generate stage ${currentStage} of a ${theme} math quest for ${name} (${grade}). Previous score: ${score || 0}. Make the narrative exciting and the math grade-appropriate!`;

    try {
      const result = await generateChatCompletion(systemPrompt, userPrompt, 600);
      const questStage = JSON.parse(result);
      return NextResponse.json(questStage);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        const mock = generateMockQuest({ name, grade, theme, stage: currentStage, score: score || 0 });
        return NextResponse.json(mock);
      }
      throw error;
    }
  } catch (error) {
    console.error("Math quest generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate math quest. Please try again." },
      { status: 500 }
    );
  }
}
