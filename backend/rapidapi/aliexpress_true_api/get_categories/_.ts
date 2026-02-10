import axios from "axios";

export interface GetCategoriesParams {
  language?: string;
}

export interface Category {
  id: string;
  name: string;
  sub_categories?: Category[];
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<Category[] | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/categories",
    params: {
      language: params.language || "en",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<{ categories: Category[] }>(options);
    return response.data.categories;
  } catch (error) {
    console.error("API Call Failed:", error);
    return null;
  }
}
