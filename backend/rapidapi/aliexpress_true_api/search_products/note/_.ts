import { searchProducts } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
    console.log("Starting Search Products Test...");
    
    if (!process.env.RAPIDAPI_KEY) {
        console.error("RAPIDAPI_KEY is missing!");
        process.exit(1);
    }

    try {
        const result = await searchProducts({
            search_query: "wireless earbuds",
            page: 1,
            sort: "orders_desc",
            target_country: "US",
            target_currency: "USD"
        });

        console.log("Search Result Summary:");
        console.log(`Total Results: ${result?.total_results}`);
        console.log(`Products Found: ${result?.products.length}`);
        
        if (result?.products.length ? result.products.length > 0 : false) {
            console.log("First Product:", result!.products[0]);
        }
    } catch (e) {
        console.error("Test Failed:", e);
    }

    process.exit(0);
})();
