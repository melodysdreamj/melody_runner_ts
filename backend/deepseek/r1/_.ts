
import OpenAI from 'openai';
export async function requestDeepseekR1Chat(question: string): Promise<string | null> {
    try {

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            console.error("DEEPSEEK_API_KEY is not set.");
            return null;
        }

        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey,
        });

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: question }
            ],
            model: "deepseek-reasoner",
        });

        return chatCompletion.choices[0].message.content;
    } catch (err) {
        console.error("Error in DeepSeek R1 chat:", err);
        return null;
    }
}
