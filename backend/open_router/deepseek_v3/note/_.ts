
import { requestOpenRouterDeepseekV3 } from "../_";

;(async () => {
  console.log("start DeepSeek V3 Test");

  const response = await requestOpenRouterDeepseekV3(
    "Tell me about the upcoming meeting on Friday."
  );
  console.log(response);
  process.exit(0);
})();

export {};
