import OpenAI from 'openai';
const WANDB_TARGET_HOST = "api.inference.wandb.ai";
const MODEL_ID = "Qwen/Qwen3-235B-A22B-Instruct-2507";

/**
 * Requests a chat completion from the Qwen3 model via Cloudflare AI Gateway (Universal Endpoint).
 * Routes logic: Cloudflare Gateway -> W&B Inference API -> Qwen3
 * 
 * @param question The user's question.
 * @param onChunk Optional callback to receive chunks as they stream in.
 * @returns The complete response string.
 */
export async function requestCloudflareGatewayWbQwen3(
    question: string,
    onChunk?: (chunk: string) => void
): Promise<string | null> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME;
    const apiKey = process.env.WANDB_API_KEY;

    if (!accountId || !gatewayName) {
        console.error("Missing Cloudflare Gateway configuration (CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_GATEWAY_NAME)");
        return null;
    }
    if (!apiKey) {
        console.error("Missing WANDB_API_KEY environment variable");
        return null;
    }

    // Universal Endpoint Construction
    // Format: https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/{target_host}/{target_path}
    // W&B base: https://api.inference.wandb.ai/v1
    // Target Host: api.inference.wandb.ai
    // Target Path: v1
    const baseURL = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/${WANDB_TARGET_HOST}/v1`;

    const client = new OpenAI({
        baseURL: baseURL,
        apiKey: apiKey,
    });

    try {
        const stream = await client.chat.completions.create({
            model: MODEL_ID,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: question }
            ],
            stream: true,
        });

        let fullContent = "";
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                fullContent += content;
                if (onChunk) {
                    onChunk(content);
                }
            }
        }
        return fullContent;

    } catch (error) {
        console.error("Error calling Cloudflare Gateway (W&B Qwen3):", error);
        return null;
    }
}
