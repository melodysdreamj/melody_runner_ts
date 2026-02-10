import { requestQwenChat } from "../_";

async function run() {
    console.log("📝 Testing Qwen3 235B (W&B Inference)...");
    
    // Korean Question
    const question = "TypeScript의 주요 장점을 한 문장으로 설명해줘.";

    console.log(`\n❓ Question: ${question}\n`);
    console.log("--- Stream Output Start ---");

    try {
        const fullResponse = await requestQwenChat(question, (chunk) => {
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
