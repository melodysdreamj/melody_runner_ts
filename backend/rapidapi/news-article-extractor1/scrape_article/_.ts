import axios from "axios";

export interface ArticleScrapeResponse {
  title: string;
  url: string;
  tags: string[];
  format: string;
  content: string;
}

export async function scrapeArticle(
  articleUrl: string
): Promise<ArticleScrapeResponse> {
  const options = {
    method: "GET",
    url: "https://news-article-extractor1.p.rapidapi.com/api/scrape_article",
    params: {
      url: articleUrl,
      format: "text",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "news-article-extractor1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<ArticleScrapeResponse>(options);
    return response.data;
  } catch (error) {
    // console.error("Error scraping article:", error);
    throw error;
  }
}
