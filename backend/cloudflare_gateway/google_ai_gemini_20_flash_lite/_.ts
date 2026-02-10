import { GoogleGenerativeAI } from '@google/generative-ai';

export async function requestCloudflareGatewayGemini20FlashLite(prompt: string): Promise<string | null> {
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const GATEWAY_NAME = process.env.CLOUDFLARE_GATEWAY_NAME;
    const GOOGLE_STUDIO_API_KEY = process.env.GOOGLE_STUDIO_API_KEY;

    if (!ACCOUNT_ID || !GATEWAY_NAME || !GOOGLE_STUDIO_API_KEY) {
        console.error('Required environment variables are not set (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_GATEWAY_NAME, GOOGLE_STUDIO_API_KEY).');
        return null;
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_STUDIO_API_KEY);

    const model = genAI.getGenerativeModel(
        { model: "gemini-2.0-flash-lite" },
        {
            baseUrl: `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_NAME}/google-ai-studio`,
        },
    );

    try {
        // console.log("Gemini 2.0 Flash Lite chat started");

        const result = await model.generateContent(prompt);
        const response = result.response;

        return response.text();
    } catch (error) {
        console.error("Error in Gemini 2.0 Flash Lite chat:", error);
        return null;
    }
}
