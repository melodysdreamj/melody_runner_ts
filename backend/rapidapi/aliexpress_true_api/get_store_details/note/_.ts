import { getStoreDetails } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
    console.log("Fetching Store Details...");
    try {
        const store = await getStoreDetails({ store_id: "123456" }); // Sample Store ID
        console.log("Store Name:", store?.store_name);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
