import dotenv from "dotenv";
import { searchByTopicHeadlines } from "./_";

dotenv.config();

;(async () => {
  console.log("start");

  let result = await searchByTopicHeadlines("us", "en", "General");

  console.log(result);
  process.exit(0);
})();

export {};
