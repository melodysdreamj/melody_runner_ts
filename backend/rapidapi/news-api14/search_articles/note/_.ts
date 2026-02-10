import dotenv from "dotenv";
import { searchArticles } from "./_";

dotenv.config();

;(async () => {
  console.log("start");

  const searchArticlesResult = await searchArticles("송도", "ko");

  console.log(searchArticlesResult);
  process.exit(0);
})();

export {};
