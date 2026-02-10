import { searchByKeyword } from "./_";

;(async () => {
  console.log("start");

  let result = await searchByKeyword("euro", "us", "en", 10);

  console.log(result);
  process.exit(0);
})();

export {};
