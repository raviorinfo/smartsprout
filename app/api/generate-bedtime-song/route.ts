import { NextRequest, NextResponse } from "next/server";
import { generateChatCompletion } from "@/lib/openai";

function generateMockSong(name: string, age: string, dayActivity: string, theme: string): string {
  const moods: Record<string, { verse1End: string; chorus: string; verse2: string; outro: string }> = {
    "gentle piano": {
      verse1End: `You played so hard, you laughed and learned,\nAnd ${dayActivity.toLowerCase()} was such a thrill.`,
      chorus: `Close your eyes, drift away,\nYou had such a wonderful day.\nThe moon is watching, soft and bright,\nSweet dreams, dear ${name}, goodnight, goodnight.`,
      verse2: `The world is quiet, soft and still,\nThe stars are dancing on the hill.\nTomorrow holds more games to play,\nBut now it's time to end the day.`,
      outro: `Sleep tight, little one, sleep tight...\nThe stars will keep you company tonight.\nGoodnight, goodnight...`
    },
    "music box": {
      verse1End: `With every spin, the day unwinds,\nAnd ${dayActivity.toLowerCase()} fades to dreams.`,
      chorus: `Tinkle, tinkle, music plays,\nTurning, turning, end of days.\n${name}'s eyes are getting small,\nThe sweetest sleeper of them all.`,
      verse2: `The music box spins round and round,\nA gentle, soothing, sleepy sound.\nEach tiny note whispers to say,\n"Well done, you had a lovely day."`,
      outro: `Round and round the melody goes...\nAs ${name}'s little eyes gently close.\nGoodnight...`
    },
    "acoustic guitar": {
      verse1End: `Strum, strum, the guitar hums,\nA song for when the evening comes.`,
      chorus: `La la la, the day is done,\n${name} shines brighter than the sun.\nBut even stars need rest to glow,\nSo close your eyes, nice and slow.`,
      verse2: `${dayActivity} made you smile so wide,\nBut now the moon is by your side.\nThe guitar strums a lullaby,\nBeneath the painted evening sky.`,
      outro: `Strum... strum... strum...\nGoodnight, ${name}. Sweet dreams will come...`
    },
    "ocean waves": {
      verse1End: `The waves roll in, the waves roll out,\nWashing away all worry and doubt.`,
      chorus: `Splash, splash, the ocean sighs,\nReflecting stars across the skies.\n${name}, you're safe upon the shore,\nThe ocean sings forevermore.`,
      verse2: `Today you ${dayActivity.toLowerCase()}, how wonderful!\nBut now the tide says "rest, dear one."\nThe seashells hum a sleepy tune,\nBeneath the silver glowing moon.`,
      outro: `Whoooosh... whoooosh...\nThe ocean rocks you gently to sleep.\nGoodnight, little fish. Goodnight...`
    }
  };

  const mood = moods[theme] || moods["gentle piano"];
  
  return `(Verse 1)
The sun goes down, the stars come out,
It's time to rest, without a doubt.
${mood.verse1End}

(Chorus)
${mood.chorus}

(Verse 2)
${mood.verse2}

(Bridge)
${name} is ${age || "little"}, brave and kind,
With the most amazing, curious mind.
Every day's a chance to grow,
And every night, the love just flows.

(Outro)
${mood.outro}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, dayActivity, theme } = body;

    if (!name || !dayActivity) {
      return NextResponse.json(
        { error: "Missing required fields: name, dayActivity" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a talented children's songwriter who creates personalized bedtime lullabies. 

RULES:
- Write a gentle, soothing lullaby personalized for a child named "${name}" (age ${age || "young"})
- Reference their day activity: "${dayActivity}"
- Musical style: ${theme || "gentle piano"}
- Include: 2 verses, a chorus, a bridge, and a short outro
- Format with (Verse 1), (Chorus), (Verse 2), (Bridge), (Outro) labels
- Use simple, calming words. The song should make a child feel safe and loved.
- NEVER include anything scary, sad, or inappropriate
- The rhythm should feel natural when read/sung aloud
- Include the child's name 2-3 times naturally in the lyrics

RESPOND ONLY with valid JSON:
{
  "lyrics": "The full song lyrics with section headers"
}`;

    const userPrompt = `Write a personalized bedtime song for ${name} (age ${age || "young"}). Today they ${dayActivity}. Style: ${theme || "gentle piano"}. Make it soothing and sweet.`;

    try {
      const result = await generateChatCompletion(systemPrompt, userPrompt, 1000);
      const data = JSON.parse(result);
      return NextResponse.json({ lyrics: data.lyrics });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "MOCK_MODE") {
        const lyrics = generateMockSong(name, age, dayActivity, theme || "gentle piano");
        return NextResponse.json({ lyrics });
      }
      throw error;
    }
  } catch (error) {
    console.error("Bedtime song generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate bedtime song. Please try again." },
      { status: 500 }
    );
  }
}
