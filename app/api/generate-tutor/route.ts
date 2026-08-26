import { NextRequest, NextResponse } from "next/server";
import { isMockMode, transcribeAudio, generateSpeech } from "@/lib/openai";
import { checkRateLimit, getClientId } from "@/lib/rateLimit";
import OpenAI from "openai";

const MOCK_RESPONSES: Record<string, string> = {
  math: "Great question! Let's figure that out together. Can you break the problem into smaller pieces? For example, what's the first step you'd try? 🧮",
  science: "Wow, that's a really curious question! 🔬 Let me ask you this: what do you already know about how that works? Sometimes the answer is hiding in what you already know!",
  history: "Ooh, a history mystery! 🏛️ Let's think like detectives. What clues do you have about when or where this happened? That can help us narrow it down!",
  space: "A space explorer question! 🚀 That's awesome. Before I help, tell me — what do you think happens and why? Your guess might be closer than you think!",
  default: "That's a fantastic question! 🌟 Let's think about it together like scientists. Instead of me telling you, what's your best guess? I bet your brain already has some great ideas!"
};

function getMockResponse(userMessage: string, history: { role: string; content: string }[]): string {
  const lower = userMessage.toLowerCase();
  const turnCount = history.filter(m => m.role === "user").length;
  
  // First interaction - encourage exploration
  if (turnCount <= 1) {
    if (lower.match(/\d/) || lower.includes("math") || lower.includes("add") || lower.includes("subtract") || lower.includes("multiply")) {
      return MOCK_RESPONSES.math;
    }
    if (lower.includes("space") || lower.includes("planet") || lower.includes("star") || lower.includes("moon") || lower.includes("sun")) {
      return MOCK_RESPONSES.space;
    }
    if (lower.includes("science") || lower.includes("why") || lower.includes("how does") || lower.includes("what makes")) {
      return MOCK_RESPONSES.science;
    }
    if (lower.includes("history") || lower.includes("who was") || lower.includes("when did")) {
      return MOCK_RESPONSES.history;
    }
    return MOCK_RESPONSES.default;
  }
  
  // Follow-up interactions - provide more guidance
  if (turnCount === 2) {
    return "You're getting warmer! 🔥 That's a really smart way to think about it. Now, what if we tried looking at it from a different angle? What would happen if...? Keep going, you're doing great!";
  }
  
  if (turnCount === 3) {
    return "You're amazing at this! 🌟 You've almost figured it out. Let me give you a little hint: the answer has to do with how things work together. Can you put the pieces together now?";
  }
  
  // Later interactions
  return "Wow, you've been thinking so hard and doing such a great job! 🎉 You're asking questions like a real scientist. Remember, the best discoveries come from being curious — just like you! What else would you like to explore?";
}

export async function POST(request: NextRequest) {
  try {
    const { allowed, remaining } = checkRateLimit(getClientId(request), { maxRequests: 30, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment and try again!" }, { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } });
    }

    let message = "";
    let history: { role: string; content: string }[] = [];
    
    // Parse FormData instead of JSON to support audio files
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;
    const historyString = formData.get("history") as string;
    message = (formData.get("message") as string) || "";
    
    if (historyString) {
      try {
        history = JSON.parse(historyString);
      } catch (e) {
        history = [];
      }
    }

    if (audioFile && !isMockMode()) {
      try {
        message = await transcribeAudio(audioFile);
      } catch (err) {
        console.error("Transcription failed:", err);
      }
    }

    if (!message) {
      return NextResponse.json(
        { error: "Missing message or audio" },
        { status: 400 }
      );
    }

    // Build conversation history for the AI
    const conversationHistory: { role: string; content: string }[] = history || [];

    if (isMockMode()) {
      // Return a context-aware mock response (no audio generated in mock mode to save complexity, or could return a hardcoded beep)
      const mockReply = getMockResponse(message, conversationHistory);
      return NextResponse.json({ reply: mockReply });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are "Sprout", a warm, encouraging AI tutor for children ages 3-10 on the Kiddleaf platform.

YOUR METHOD: The Socratic Method
- NEVER give direct answers to factual questions
- Instead, ask guiding questions that help the child discover the answer themselves
- Break complex problems into smaller, manageable steps
- Celebrate effort and reasoning, not just correct answers
- Use age-appropriate language, emojis, and enthusiasm

SAFETY RULES (CRITICAL):
- NEVER discuss violence, weapons, drugs, or inappropriate topics
- If a child asks something inappropriate, gently redirect: "That's not something I can help with, but let's explore something amazing instead!"
- NEVER ask for or acknowledge personal information (name, address, school, etc.)
- NEVER generate content that could be scary or distressing
- Keep all responses positive, educational, and encouraging

PERSONALITY:
- Warm, patient, and endlessly curious
- Use simple words and short sentences
- Include relevant emojis (1-2 per response)
- Keep responses under 100 words
- Sound like a friendly, knowledgeable older sibling`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("No response generated from AI");
    }

    // Generate speech from the reply
    let audioBase64 = null;
    try {
      audioBase64 = await generateSpeech(reply, "nova");
    } catch (err) {
      console.error("TTS generation failed:", err);
      // It's okay if TTS fails, we still return the text
    }

    return NextResponse.json({ reply, audio: audioBase64, transcribedMessage: message });
  } catch (error) {
    console.error("Tutor generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}
