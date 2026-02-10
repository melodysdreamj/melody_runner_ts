
import OpenAI from "openai";
export async function openRouterGenerateO3Mini(
  text: string
): Promise<string | null> {
  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "openai/o3-mini",
      messages: [{ role: "user", content: text }],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Error generating text:", err);
    return null;
  }
}
