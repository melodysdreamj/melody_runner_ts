
import { requestDeepseekR1Chat } from "../_";

;(async () => {
    console.log("DeepSeek R1 Chat Test Start");

    const question = "Tell me about the upcoming meeting on Friday.";
    console.log(`Question: ${question}`);

    const response = await requestDeepseekR1Chat(question);
    console.log("\nResponse:");
    console.log(response);

    process.exit(0);
})();

export {};
