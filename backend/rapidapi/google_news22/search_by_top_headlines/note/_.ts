import dotenv from "dotenv";
import { searchByTopHeadlines } from "./_";

dotenv.config();

;(async () => {
  console.log("start");

  let result = await searchByTopHeadlines("us", "en");

  console.log(result);
  process.exit(0);
})();

export {};
