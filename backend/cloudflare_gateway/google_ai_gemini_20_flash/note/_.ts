import dotenv from "dotenv";
import { requestCloudflareGatewayGemini20Flash } from "../_";

dotenv.config();

;(async () => {
    console.log("start");
    
    const result = await requestCloudflareGatewayGemini20Flash("Hello, tell me a short joke about coding.");
    console.log("Result:", result);

    process.exit(0);
})();

export {};
