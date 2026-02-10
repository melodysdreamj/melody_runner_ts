import { getReviews } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
    console.log("Fetching Reviews...");
    try {
        const result = await getReviews({ 
            product_id: "1005001234567890",
            page: 1,
            filter: "with_image" 
        });
        console.log("Total Reviews:", result?.total_results);
        if (result?.reviews.length ? result.reviews.length > 0 : false) {
            console.log("First Review:", result?.reviews[0].content);
        }
    } catch (e) {
        console.error("Review fetch failed:", e);
    }
    process.exit(0);
})();
