
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
export async function requestGemini20Flash(
  prompt: string
): Promise<string | null> {

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error in requestGemini20Flash:", error);
    return null;
  }
}
