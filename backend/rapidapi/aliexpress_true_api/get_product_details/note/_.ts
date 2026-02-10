import { getProductDetails } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
    console.log("Starting Product Details Test...");
    
    // Sample ID (should be replaced with a valid one for real test)
    const SAMPLE_PRODUCT_ID = "1005001234567890"; 

    try {
        const result = await getProductDetails({
            product_id: SAMPLE_PRODUCT_ID,
            target_country: "US",
            target_currency: "USD"
        });

        if (result) {
            console.log("Title:", result.product_title);
            console.log("Price:", result.sale_price);
            console.log("Images:", result.product_images.length);
        } else {
            console.log("No result returned (ID might be invalid)");
        }
    } catch (e) {
        console.error("Test Failed:", e);
    }

    process.exit(0);
})();
