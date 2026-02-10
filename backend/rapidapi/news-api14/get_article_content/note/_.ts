import dotenv from "dotenv";
import { getArticleContent } from "./_";

dotenv.config();

;(async () => {
  console.log("start");

  const articleContent = await getArticleContent(
    "https://slate.com/news-and-politics/2025/06/supreme-courts-liberal-opinions-kagan-jackson-sotomayor.html"
  );

  console.log(articleContent);
  process.exit(0);
})();

export {};
