import { requestCloudflareGatewayWbQwen3 } from "../_";

async function run() {
    console.log("📝 Testing Qwen3 235B (via Cloudflare Gateway)...");
    
    // Korean Question
    const question = "Cloudflare Gateway가 무엇인지 간단히 설명해줘.";

    console.log(`\n❓ Question: ${question}\n`);
    console.log("--- Stream Output Start ---");

    try {
        const fullResponse = await requestCloudflareGatewayWbQwen3(question, (chunk) => {
            process.stdout.write(chunk);
        });

        console.log("\n--- Stream Output End ---\n");
        console.log("✅ Final Full Response:");
        console.log(fullResponse);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

run();
