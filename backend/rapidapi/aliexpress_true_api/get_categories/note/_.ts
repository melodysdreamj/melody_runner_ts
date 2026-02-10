import { getCategories } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
    console.log("Fetching Categories...");
    try {
        const categories = await getCategories({ language: "en" });
        console.log("Categories found:", categories?.length);
        if (categories && categories.length > 0) {
             console.log("First Category:", categories[0]);
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
