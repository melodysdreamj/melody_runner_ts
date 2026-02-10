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

export interface GoogleNewsGeolocationResponse {
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

export async function searchByGeolocation(
  country: string,
  language: string,
  location: string
): Promise<NewsArticle[]> {
  const options = {
    method: "GET",
    url: "https://google-news22.p.rapidapi.com/v1/geolocation",
    params: {
      country: country,
      language: language,
      location: location,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "google-news22.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<GoogleNewsGeolocationResponse>(
      options
    );
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
    console.error("Error fetching Google News by geolocation:", error);
    return [];
  }
}
