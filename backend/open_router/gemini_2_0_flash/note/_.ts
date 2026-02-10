
import { requestGemini20Flash } from "../_";

;(async () => {
  console.log("start Gemini 2.0 Flash Test");

  const response = await requestGemini20Flash("하늘이 파란 이유는 무엇인가요?");
  console.log(response);
  process.exit(0);
})();

export {};
