import axios from "axios";

export interface Publisher {
  name: string;
  url: string;
  favicon?: string;
}

export interface SearchArticle {
  title: string;
  url: string;
  excerpt: string;
  thumbnail?: string;
  language: string;
  paywall: boolean;
  contentLength: number;
  date: string;
  authors: string[];
  keywords: string[];
  publisher: Publisher;
}

export interface NewsApi14SearchResponse {
  success: boolean;
  size: number;
  totalHits: number;
  hitsPerPage: number;
  page: number;
  totalPages: number;
  timeMs: number;
  data: SearchArticle[];
}

export async function searchArticles(
  query: string,
  language: string
): Promise<SearchArticle[]> {
  const options = {
    method: "GET",
    url: "https://news-api14.p.rapidapi.com/v2/search/articles",
    params: {
      query: query,
      language: language,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "news-api14.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<NewsApi14SearchResponse>(options);
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error searching articles from News API14:", error);
    return [];
  }
}
