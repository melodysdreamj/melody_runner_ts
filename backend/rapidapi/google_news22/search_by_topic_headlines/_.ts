import axios from "axios";

// 유효한 토픽 값들을 배열로 정의합니다.
export const VALID_TOPICS: ReadonlyArray<string> = [
  "General",
  "Entertainment",
  "World",
  "Business",
  "Health",
  "Sports",
  "Science",
  "Technology",
  "Autos",
  "Beauty",
  "Cryptocurrency",
  "Economy",
  "Education",
  "Finance",
  "Gadgets",
  "Gaming",
  "Lifestyle",
  "Markets",
  "Movies",
  "Music",
  "Politics",
  "Soccer",
  "Startup",
];

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

export interface GoogleNewsTopicHeadlinesResponse {
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

export async function searchByTopicHeadlines(
  country: string,
  language: string,
  topic: string
): Promise<NewsArticle[]> {
  // 입력된 topic이 유효한지 검사합니다.
  if (!VALID_TOPICS.includes(topic)) {
    console.error(
      `Invalid topic: ${topic}. Must be one of ${VALID_TOPICS.join(", ")}`
    );
    return [];
  }

  const options = {
    method: "GET",
    url: "https://google-news22.p.rapidapi.com/v1/topic-headlines",
    params: {
      country: country,
      language: language,
      topic: topic.toLowerCase(),
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": "google-news22.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<GoogleNewsTopicHeadlinesResponse>(
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
    console.error("Error fetching Google News by topic headlines:", error);
    return [];
  }
}
