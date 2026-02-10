import dotenv from "dotenv";
import { requestCloudflareGatewayGemini20FlashLite } from "../_";

dotenv.config();

;(async () => {
    console.log("start");
    
    const result = await requestCloudflareGatewayGemini20FlashLite("Hello, tell me a short joke about coding.");
    console.log("Result:", result);

    process.exit(0);
})();

export {};
