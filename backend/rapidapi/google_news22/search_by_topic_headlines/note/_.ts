import { searchByTopicHeadlines } from "./_";

;(async () => {
  console.log("start");

  let result = await searchByTopicHeadlines("us", "en", "General");

  console.log(result);
  process.exit(0);
})();

export {};
