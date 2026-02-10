
import { DuckDuckGo } from "../_";

;(async () => {
    console.log("start DuckDuckGo search test");

    const query = '인천 송도';
    console.log(`Searching for: ${query}...`);

    const results = await DuckDuckGo.search(query);

    console.log(`Found ${results.length} results:`);
    results.forEach((item, index) => {
        console.log(`[${index + 1}] ${item.title}`);
        console.log(`    Link: ${item.link}`);
    });

    process.exit(0);
})();

export {};
