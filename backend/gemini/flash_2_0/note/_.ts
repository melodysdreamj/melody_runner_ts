
import { requestGemini20Flash } from "../_";

;(async () => {
  console.log("start Gemini 2.0 Flash (Text) Test");

  const prompt = "하늘이 푸른 이유는 무엇인가요?";
  console.log(`Prompt: ${prompt}`);

  const response = await requestGemini20Flash(prompt);
  console.log("\nResponse:");
  console.log(response);

  process.exit(0);
})();

export {};
