
import { requestDeepseekV3Chat } from "../_";

;(async () => {
    console.log("DeepSeek V3 Chat Test Start");

    const question = "Tell me about the upcoming meeting on Friday.";
    console.log(`Question: ${question}`);

    const response = await requestDeepseekV3Chat(question);
    console.log("\nResponse:");
    console.log(response);

    process.exit(0);
})();

export {};
