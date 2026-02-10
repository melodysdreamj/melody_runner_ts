import { scrapeArticle } from "./_";

;(async () => {
  console.log("start");

  const article = await scrapeArticle(
    "https://www.chosun.com/politics/election2025/2025/06/05/MHIXQHPJQVGLBFM7JIF4NHFHRM/"
  );
  console.log(article.title);
  console.log(article.content);
  process.exit(0);
})();

export {};
