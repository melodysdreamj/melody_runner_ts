
import OpenAI from "openai";
import dotenv from "dotenv";

export async function requestOpenRouterDeepseekV3(
  prompt: string
): Promise<string | null> {
  try {
    dotenv.config();
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (completion.choices && completion.choices[0]?.message?.content) {
      return completion.choices[0].message.content;
    }

    return null;
  } catch (error) {
    console.error("Error in requestOpenRouterDeepseekV3:", error);
    return null;
  }
}
