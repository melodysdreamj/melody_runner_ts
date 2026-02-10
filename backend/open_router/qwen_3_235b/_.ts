
import OpenAI from "openai";
export async function requestOpenRouterQwen3_235B_A22B_2507(
  prompt: string
): Promise<string | null> {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-235b-a22b-2507",
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
    // console.error("Error in requestOpenRouterQwen3_235B_A22B_2507:", error);
    return null;
  }
}
