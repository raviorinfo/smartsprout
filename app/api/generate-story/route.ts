import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/openai";

const MOCK_STORY = {
  title: "Luna's Magical Space Adventure",
  chapters: [
    {
      pageNumber: 1,
      text: "Once upon a time, in a cozy little house on Maple Street, there lived a curious child named Luna. Every night before bed, Luna would gaze at the stars through the bedroom window, wondering what adventures awaited among the twinkling lights.",
      illustrationPrompt: "A child looking out a window at a starry night sky, warm bedroom with fairy lights",
    },
    {
      pageNumber: 2,
      text: "One magical evening, a tiny silver rocket ship appeared on the windowsill! It sparkled and hummed, growing bigger and bigger until it was just the right size. 'Would you like to fly to the stars?' whispered the rocket in a friendly voice.",
      illustrationPrompt: "A magical silver rocket ship growing on a windowsill with sparkles around it",
    },
    {
      pageNumber: 3,
      text: "Luna climbed inside, and WHOOOOSH! They zoomed past the moon, which waved hello with a big cheesy grin. They flew through a rainbow nebula where the colors danced like paint in water. 'This is amazing!' Luna giggled with delight.",
      illustrationPrompt: "A rocket ship flying past a smiling moon through a colorful nebula",
    },
    {
      pageNumber: 4,
      text: "They landed on a fluffy cloud planet where friendly star creatures played tag. The littlest star, named Twinkle, gave Luna a gift — a small bottle filled with stardust. 'Whenever you feel brave, sprinkle some,' Twinkle said with a warm glow.",
      illustrationPrompt: "Cute star creatures playing on fluffy clouds, one giving a bottle of stardust to a child",
    },
    {
      pageNumber: 5,
      text: "As the night sky began to lighten, Luna flew back home with a heart full of wonder. Tucked in bed with the stardust bottle glowing softly on the nightstand, Luna smiled. Every star in the sky was now a friend. 'Goodnight, stars,' Luna whispered. And somewhere up above, the stars twinkled back. The End. 🌟",
      illustrationPrompt: "A child peacefully sleeping in bed with a glowing bottle of stardust on the nightstand, stars visible through the window",
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childName, age, theme, storyLength } = body;

    if (!childName || !age || !theme) {
      return NextResponse.json(
        { error: "Missing required fields: childName, age, theme" },
        { status: 400 }
      );
    }

    const pageCount = storyLength === "medium" ? 7 : 5;

    const systemPrompt = `You are a beloved children's storybook author. Create enchanting, age-appropriate bedtime stories for children.

RULES:
- The story MUST be appropriate for a ${age}-year-old child
- Use simple, warm, imaginative language
- Include positive themes like kindness, bravery, friendship, and curiosity
- NEVER include scary, violent, or inappropriate content
- The main character should be named "${childName}"
- Theme: ${theme}
- Create exactly ${pageCount} pages/chapters

RESPOND ONLY with valid JSON in this exact format:
{
  "title": "Story Title Here",
  "chapters": [
    {
      "pageNumber": 1,
      "text": "Story text for this page (2-4 sentences, age-appropriate vocabulary)",
      "illustrationPrompt": "Brief description of an illustration for this page"
    }
  ]
}`;

    const userPrompt = `Create a ${storyLength} bedtime story for ${childName} (age ${age}) about the theme: ${theme}. Make it magical, heartwarming, and end with a positive message.`;

    try {
      const result = await generateChatCompletion(systemPrompt, userPrompt, 3000);
      const story = JSON.parse(result);
      return NextResponse.json(story);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        // Return mock data with customized name and theme
        const mockStory = {
          ...MOCK_STORY,
          title: `${childName || "Luna"}'s Magical ${theme} Adventure`,
          chapters: MOCK_STORY.chapters.map((ch) => ({
            ...ch,
            text: ch.text.replace(/Luna/g, childName || "Luna").replace(/space/gi, theme).replace(/rocket ship/gi, `magical ${theme} transport`).replace(/stars/gi, `${theme} elements`),
          })),
        };
        return NextResponse.json(mockStory);
      }
      throw error;
    }
  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate story. Please try again." },
      { status: 500 }
    );
  }
}
