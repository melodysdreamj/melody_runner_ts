import { requestCloudflareGatewayOpenRouterGemini20Flash } from "../_";

;(async () => {
    console.log("start");
    
    const result = await requestCloudflareGatewayOpenRouterGemini20Flash("Hello, tell me a short joke about coding.");
    console.log("Result:", result);

    process.exit(0);
})();

export {};
