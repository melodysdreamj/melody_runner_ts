import dotenv from "dotenv";
import { requestGpt4oChat } from "../_";

dotenv.config();

;(async () => {
    console.log("start GPT-4o Mini Test");

    let response = await requestGpt4oChat("Tell me about the upcoming meeting on Friday.");
    console.log(response);

    process.exit(0);
})();

export {};
