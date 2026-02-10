import { searchByTopHeadlines } from "./_";

;(async () => {
  console.log("start");

  let result = await searchByTopHeadlines("us", "en");

  console.log(result);
  process.exit(0);
})();

export {};
