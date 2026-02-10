import { getTrendingNews } from "./_";

;(async () => {
  const trendingNews = await getTrendingNews("General", "ko");
  console.log(trendingNews);

  console.log("start");
  process.exit(0);
})();

export {};
