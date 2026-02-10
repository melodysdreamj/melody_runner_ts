import dotenv from "dotenv";
import { getTrendingNews } from "./_";

dotenv.config();

;(async () => {
  const trendingNews = await getTrendingNews("General", "ko");
  console.log(trendingNews);

  console.log("start");
  process.exit(0);
})();

export {};
