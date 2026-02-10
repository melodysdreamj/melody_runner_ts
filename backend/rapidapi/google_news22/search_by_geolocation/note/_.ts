import dotenv from "dotenv";
import { searchByGeolocation } from "./_";

dotenv.config();

;(async () => {
  console.log("start");

  let result = await searchByGeolocation("us", "en", "new york");

  console.log(result);
  process.exit(0);
})();

export {};
