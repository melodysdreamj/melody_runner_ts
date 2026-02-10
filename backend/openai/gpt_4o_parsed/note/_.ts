import dotenv from "dotenv";
import { requestNewGpt4oParsedChat } from "../_";

dotenv.config();

;(async () => {
    console.log("start GPT-4o Parsed Test");

    const event = await requestNewGpt4oParsedChat("Tell me about the upcoming meeting on Friday.");
    console.log(event);

    process.exit(0);
})();

export {};
