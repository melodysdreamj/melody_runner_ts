import { searchByGeolocation } from "./_";

;(async () => {
  console.log("start");

  let result = await searchByGeolocation("us", "en", "new york");

  console.log(result);
  process.exit(0);
})();

export {};
