import axios from "axios";

export interface SourceInfo {
  name: string;
  url: string;
  favicon?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  date: string;
  thumbnail?: string;
  description?: string;
  source?: SourceInfo;
}

export interface GoogleNewsResponse {
  success: boolean;
  total: number;
  data: Array<{
    title: string;
    url: string;
    date: string;
    thumbnail?: string;
    description?: string;
    source?: SourceInfo;
    keywords?: string[];
    authors?: string[];
  }>;
}

export async function searchByTopHeadlines(
  country: string,
  language: string
): Promise<NewsArticle[]> {
  const options = {
    method: "GET",
    url: "https://google-news22.p.rapidapi.com/v1/top-headlines",
    params: {
      country: country,
      language: language,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "google-news22.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<GoogleNewsResponse>(options);
    if (response.data && response.data.data) {
      return response.data.data.map((item) => ({
        title: item.title,
        url: item.url,
        date: item.date,
        thumbnail: item.thumbnail,
        description: item.description,
        source: item.source,
      }));
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
}
