import dotenv from "dotenv";
import { requestOpenRouterClaude35Sonnet } from "../_";

dotenv.config();

;(async () => {
  console.log("start Claude 3.5 Sonnet Test");

  const response = await requestOpenRouterClaude35Sonnet(
    "Tell me about the upcoming meeting on Friday."
  );

  console.log(response);
    process.exit(0);
})();

export {};
