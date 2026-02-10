import dotenv from "dotenv";
import { requestCloudflareGatewayOpenRouterGemini20Flash } from "../_";

dotenv.config();

;(async () => {
    console.log("start");
    
    const result = await requestCloudflareGatewayOpenRouterGemini20Flash("Hello, tell me a short joke about coding.");
    console.log("Result:", result);

    process.exit(0);
})();

export {};
