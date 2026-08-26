import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export function isMockMode(): boolean {
  return getOpenAIClient() === null;
}

export async function generateChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MOCK_MODE");
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error (Chat):", error);
    throw new Error("MOCK_MODE");
  }
}

export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024"
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MOCK_MODE");
  }

  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality: "standard",
      response_format: "b64_json",
    });

    return response.data?.[0]?.b64_json || "";
  } catch (error) {
    console.error("OpenAI API Error (Image):", error);
    throw new Error("MOCK_MODE");
  }
}

export async function transcribeAudio(file: File): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MOCK_MODE");
  }

  try {
    const response = await client.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });
    return response.text;
  } catch (error) {
    console.error("OpenAI API Error (Whisper):", error);
    throw new Error("MOCK_MODE");
  }
}

export async function generateSpeech(text: string, voice: "nova" | "shimmer" | "alloy" = "nova"): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MOCK_MODE");
  }

  try {
    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer.toString("base64");
  } catch (error) {
    console.error("OpenAI API Error (TTS):", error);
    throw new Error("MOCK_MODE");
  }
}

export async function analyzeImage(
  systemPrompt: string,
  base64Image: string
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MOCK_MODE");
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: "Please analyze this drawing." },
            { type: "image_url", image_url: { url: base64Image } }
          ] 
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error (Vision):", error);
    throw new Error("MOCK_MODE");
  }
}
