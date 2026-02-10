
import { requestGeminiFlash20Json } from "../_";

;(async () => {
    console.log("start Gemini 2.0 Flash (JSON) Test");

    const prompt = `인기 있는 쿠키 레시피 3가지를 아래 TypeScript 인터페이스 형식에 맞는 JSON 배열로 반환해 줘.

interface Recipe {
    recipeName: string;
    description: string;
}`;
    console.log(`Prompt: ${prompt}`);

    const response = await requestGeminiFlash20Json(prompt);
    console.log("\nResponse:");
    console.log(response);

    process.exit(0);
})();

export {};
