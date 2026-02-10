export async function requestCloudflareGatewayOpenRouterGemini20Flash(prompt: string): Promise<string | null> {
    try {
        const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
        const GATEWAY_NAME = process.env.CLOUDFLARE_GATEWAY_NAME;
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        if (!ACCOUNT_ID || !GATEWAY_NAME || !OPENROUTER_API_KEY) {
            console.error("필수 환경변수 누락: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_GATEWAY_NAME, OPENROUTER_API_KEY");
            return null;
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        });

        const response = await fetch(
            `https://gateway.ai.cloudflare.com/v1/${ACCOUNT_ID}/${GATEWAY_NAME}/openrouter/v1/chat/completions`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model: 'google/gemini-2.0-flash-001',
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        const data = await response.json();

        // Extract the response text from the OpenRouter API response
        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
        }

        return null;
    } catch (error) {
        console.error("Error in OpenRouter Gemini 2.0 Flash chat:", error);
        return null;
    }
}
