import { requestCloudflareGatewayGemini20FlashLite } from "../_";

;(async () => {
    console.log("start");
    
    const result = await requestCloudflareGatewayGemini20FlashLite("Hello, tell me a short joke about coding.");
    console.log("Result:", result);

    process.exit(0);
})();

export {};
