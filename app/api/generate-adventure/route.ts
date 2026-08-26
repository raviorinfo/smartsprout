import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/openai";
import { checkRateLimit, getClientId } from "@/lib/rateLimit";

interface AdventureResponse {
  chapter: number;
  text: string;
  choices?: { id: string; text: string }[];
  isEnding?: boolean;
}

const MOCK_STORIES: Record<string, Record<string, AdventureResponse>> = {
  start: {
    "magical forest": {
      chapter: 1,
      text: "Once upon a time, deep in a {setting}, a brave adventurer named {name} discovered a glowing path hidden behind ancient trees. The leaves shimmered with golden light, and tiny fireflies danced in patterns that seemed to spell out a message. As {name} stepped forward, the path split into two mysterious directions. To the left, a cozy-looking tree house perched high in the branches, with a rope ladder swaying in the breeze. To the right, a crystal-clear stream led to a grotto filled with sparkling mushrooms.",
      choices: [
        { id: "treehouse", text: "🌳 Climb up to the magical tree house" },
        { id: "grotto", text: "✨ Follow the stream to the glowing grotto" }
      ]
    },
    "pirate island": {
      chapter: 1,
      text: "Ahoy! A brave sailor named {name} washed ashore on a mysterious island after a wild storm. The sand sparkled like diamonds, and palm trees whispered secrets in the wind. {name} spotted an old treasure map half-buried in the sand! The map showed two paths: one led to the Laughing Caves where a friendly parrot guarded a riddle, and the other wound up Coconut Mountain where a telescope could spot faraway ships.",
      choices: [
        { id: "caves", text: "🦜 Explore the Laughing Caves" },
        { id: "mountain", text: "🔭 Climb Coconut Mountain" }
      ]
    },
    "outer space": {
      chapter: 1,
      text: "Captain {name} zoomed through the stars in a shiny silver spaceship! The dashboard beeped and flashed — there were TWO signals coming from nearby. One signal came from a friendly-looking space station shaped like a giant donut, where alien kids seemed to be having a party. The other signal came from a mysterious blue planet with rings made of rainbow light.",
      choices: [
        { id: "station", text: "🍩 Dock at the Space Station party" },
        { id: "planet", text: "🌈 Land on the Rainbow Planet" }
      ]
    }
  }
};

function getMockNextChapter(choiceId: string, chapter: number, name: string): AdventureResponse {
  if (chapter >= 3) {
    return {
      chapter: chapter + 1,
      text: `With a heart full of joy and pockets full of memories, ${name} knew this was just the beginning. The adventure had taught something special: that courage, kindness, and curiosity are the greatest treasures of all. ${name} smiled and whispered, "I can't wait for the next adventure!" And somewhere in the distance, a magical bell chimed in agreement. The End! 🌟`,
      isEnding: true
    };
  }

  const chapter2Options: Record<string, AdventureResponse> = {
    treehouse: {
      chapter: 2,
      text: `${name} climbed the rope ladder and found the most amazing tree house ever! Inside, a wise old owl wearing tiny spectacles was reading a book about magic spells. "Welcome, young adventurer!" hooted the owl. "I've been waiting for someone brave enough to climb up here. I have two gifts for you — but you can only choose one." The owl held up a glowing compass that could find lost things, and a feather pen that could draw things into existence.`,
      choices: [
        { id: "compass", text: "🧭 Take the Magic Compass" },
        { id: "pen", text: "🪶 Take the Drawing Feather" }
      ]
    },
    grotto: {
      chapter: 2,
      text: `${name} followed the stream into the grotto, and — wow! The mushrooms were like tiny lanterns, lighting up a hidden underground garden. In the center, a family of friendly gnomes was having a picnic! "Join us!" they cheered. The eldest gnome offered ${name} a choice: "Would you like to taste our Giggle Berries that make everything funny, or would you rather plant a Wish Seed in our magic garden?"`,
      choices: [
        { id: "berries", text: "😂 Try the Giggle Berries" },
        { id: "seed", text: "🌱 Plant a Wish Seed" }
      ]
    },
    caves: {
      chapter: 2,
      text: `Inside the Laughing Caves, ${name} found a colorful parrot who told the funniest jokes! "Polly wants a riddle!" squawked the parrot. "If you solve it, I'll show you the treasure room. If you can't, I'll teach you my silliest dance!" The riddle was: "I have hands but can't clap. I have a face but can't smile. What am I?" ${name} thought hard. Was it a clock or a mountain?`,
      choices: [
        { id: "clock", text: "⏰ Answer: A Clock!" },
        { id: "dance", text: "💃 Forget the riddle, teach me the dance!" }
      ]
    },
    mountain: {
      chapter: 2,
      text: `${name} climbed up Coconut Mountain, picking up shiny shells along the way. At the top, the view was incredible! Through the telescope, ${name} spotted two things: a friendly dolphin pod doing flips near a hidden cove, and a rainbow leading to a tiny floating island made of clouds. Both looked absolutely magical!`,
      choices: [
        { id: "dolphins", text: "🐬 Go meet the dolphins" },
        { id: "clouds", text: "☁️ Follow the rainbow to the cloud island" }
      ]
    },
    station: {
      chapter: 2,
      text: `The space station was AMAZING! Alien kids of all colors were playing zero-gravity games and eating floating snacks. A purple alien named Zix waved at ${name}. "Want to play Cosmic Tag with us? Or you could visit our Star Kitchen where we make food from stardust — you can create any flavor you imagine!"`,
      choices: [
        { id: "tag", text: "🏷️ Play Cosmic Tag!" },
        { id: "kitchen", text: "⭐ Visit the Star Kitchen" }
      ]
    },
    planet: {
      chapter: 2,
      text: `The Rainbow Planet was breathtaking! The ground was soft and bouncy like a trampoline, and the trees grew crystals instead of leaves. A tiny robot rolled up to ${name}. "Beep boop! I'm Guide-Bot! Would you like me to take you to the Crystal Caves where you can find your very own crystal, or to the Bounce Valley where everything floats?"`,
      choices: [
        { id: "crystals", text: "💎 Find a Crystal" },
        { id: "bounce", text: "🎈 Go to Bounce Valley" }
      ]
    }
  };

  return chapter2Options[choiceId] || {
    chapter: chapter + 1,
    text: `${name} continued the journey with excitement! Every step revealed new wonders and new friends. A magical butterfly with wings that changed color landed on ${name}'s shoulder and whispered, "The best part of any adventure is what you discover about yourself." Would ${name} like to keep exploring or find a cozy spot to rest and reflect on the journey?`,
    choices: [
      { id: "explore_more", text: "🗺️ Keep exploring!" },
      { id: "reflect", text: "🌅 Rest and enjoy the view" }
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const { allowed, remaining } = checkRateLimit(getClientId(request), { maxRequests: 20, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment and try again!" }, { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } });
    }

    const body = await request.json();
    const { name, age, setting, choiceId, chapter, previousText } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const currentChapter = chapter || 0;
    const currentSetting = setting || "magical forest";

    // Starting a new adventure
    if (currentChapter === 0) {
      const systemPrompt = `You are an interactive children's storyteller. Create a "choose-your-own-adventure" story opening.

RULES:
- The hero is named "${name}", age ${age || 5}
- Setting: ${currentSetting}
- Write in second person ("you") mixed with the child's name
- Use vivid, magical, age-appropriate descriptions
- End with EXACTLY 2 choices for the reader
- Each choice should lead to a different, exciting path
- Keep language simple and enchanting
- NEVER include anything scary, violent, or inappropriate
- The tone should be warm, exciting, and full of wonder

RESPOND ONLY with valid JSON:
{
  "chapter": 1,
  "text": "The opening paragraph of the adventure (3-5 sentences)",
  "choices": [
    { "id": "choice_1_key", "text": "Emoji + Choice 1 description" },
    { "id": "choice_2_key", "text": "Emoji + Choice 2 description" }
  ]
}`;

      const userPrompt = `Create the opening chapter of an interactive adventure for ${name} (age ${age || 5}) set in a ${currentSetting}. Make it magical and give 2 exciting choices.`;

      try {
        const result = await generateChatCompletion(systemPrompt, userPrompt, 1000);
        const storyNode = JSON.parse(result);
        return NextResponse.json(storyNode);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "MOCK_MODE") {
          const mockStory = MOCK_STORIES.start[currentSetting] || MOCK_STORIES.start["magical forest"];
          const personalizedText = mockStory.text
            .replace(/{name}/g, name)
            .replace(/{setting}/g, currentSetting);
          return NextResponse.json({ ...mockStory, text: personalizedText });
        }
        throw error;
      }
    }

    // Continuing the adventure with a choice
    const systemPrompt = `You are continuing an interactive children's adventure story.

CONTEXT:
- Hero: "${name}", age ${age || 5}
- Setting: ${currentSetting}
- Current chapter: ${currentChapter + 1}
- Previous story: "${previousText || ""}"
- The reader chose: "${choiceId}"

RULES:
- Continue the story based on the choice made
- Write 3-5 vivid, magical sentences
- ${currentChapter >= 3 ? "This is the FINAL chapter. Wrap up the story with a happy, satisfying ending. Set isEnding to true and do NOT include choices." : "End with EXACTLY 2 new choices. Set isEnding to false."}
- Keep language simple and age-appropriate
- NEVER include anything scary or inappropriate
- The tone should be warm, exciting, and full of wonder

RESPOND ONLY with valid JSON:
{
  "chapter": ${currentChapter + 1},
  "text": "The next part of the story",
  ${currentChapter >= 3 ? '"isEnding": true' : '"choices": [{ "id": "key", "text": "Emoji + choice" }, { "id": "key2", "text": "Emoji + choice 2" }]'}
}`;

    const userPrompt = `Continue the adventure for ${name}. They chose: "${choiceId}". ${currentChapter >= 3 ? "This is the final chapter — give a happy ending!" : "Give 2 new exciting choices."}`;

    try {
      const result = await generateChatCompletion(systemPrompt, userPrompt, 1000);
      const storyNode = JSON.parse(result);
      return NextResponse.json(storyNode);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        const mockChapter = getMockNextChapter(choiceId || "treehouse", currentChapter, name);
        return NextResponse.json(mockChapter);
      }
      throw error;
    }
  } catch (error) {
    console.error("Adventure generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate adventure chapter. Please try again." },
      { status: 500 }
    );
  }
}
