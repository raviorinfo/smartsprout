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
}

export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024"
): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MOCK_MODE");
  }

  const response = await client.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size,
    quality: "standard",
    response_format: "b64_json",
  });

  return response.data?.[0]?.b64_json || "";
}
