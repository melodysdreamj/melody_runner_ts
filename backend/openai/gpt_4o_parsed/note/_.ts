
import { requestNewGpt4oParsedChat } from "../_";

;(async () => {
    console.log("start GPT-4o Parsed Test");

    const event = await requestNewGpt4oParsedChat("Tell me about the upcoming meeting on Friday.");
    console.log(event);

    process.exit(0);
})();

export {};
