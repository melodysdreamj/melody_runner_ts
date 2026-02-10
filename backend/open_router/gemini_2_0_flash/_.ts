
import OpenAI from "openai";
import dotenv from "dotenv";

export async function requestGemini20Flash(
  prompt: string
): Promise<string | null> {
  try {
    dotenv.config();
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in Gemini 2.0 Flash chat:", error);
    return null;
  }
}
