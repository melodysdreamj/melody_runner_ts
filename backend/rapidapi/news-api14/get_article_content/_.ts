import axios from 'axios';

export interface Publisher {
  name: string;
  url: string;
  favicon?: string;
}

export interface ArticleContent {
  title: string;
  url: string;
  excerpt: string;
  thumbnail?: string;
  language: string;
  paywall: boolean;
  content: string;
  contentLength: number;
  date: string;
  authors: string[];
  keywords: string[];
  publisher: Publisher;
}

export interface NewsApi14ArticleResponse {
  success: boolean;
  data: ArticleContent;
}

export async function getArticleContent(url: string): Promise<ArticleContent | null> {
  const options = {
    method: 'GET',
    url: 'https://news-api14.p.rapidapi.com/v2/article',
    params: {
      url: url,
      type: 'plaintext'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': 'news-api14.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request<NewsApi14ArticleResponse>(options);

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching article content:", error);
    return null;
  }
}
