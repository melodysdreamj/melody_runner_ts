import dotenv from "dotenv";
import { openRouterGenerateO3Mini } from "../_";

dotenv.config();

;(async () => {
  console.log("start o3-mini Test");

  let response = await openRouterGenerateO3Mini(
    "하늘이 파란 이유는 무엇인가요?"
  );
  console.log(response);
  process.exit(0);
})();

export {};
