import axios from "axios";

export interface Publisher {
  name: string;
  url: string;
  favicon?: string;
}

export interface TrendingArticle {
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

export interface NewsApi14TrendingsResponse {
  success: boolean;
  size: number;
  totalHits: number;
  hitsPerPage: number;
  page: number;
  totalPages: number;
  timeMs: number;
  data: TrendingArticle[];
}

export async function getTrendingNews(
  topic: string,
  language: string
): Promise<TrendingArticle[]> {
  const options = {
    method: "GET",
    url: "https://news-api14.p.rapidapi.com/v2/trendings",
    params: {
      topic: topic,
      language: language,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "news-api14.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<NewsApi14TrendingsResponse>(options);
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching trending news from News API14:", error);
    throw error;
  }
}
