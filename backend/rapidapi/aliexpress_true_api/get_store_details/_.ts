import axios from "axios";

export interface GetStoreDetailsParams {
  store_id: string;
  language?: string;
  target_currency?: string;
}

export interface StoreDetails {
  store_id: string;
  store_name: string;
  store_url: string;
  opened_date: string;
  country: string;
  positive_feedback_rate: string;
  followers: number;
  item_description_score: number;
  communication_score: number;
  shipping_speed_score: number;
}

export async function getStoreDetails(
  params: GetStoreDetailsParams
): Promise<StoreDetails | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/store-details",
    params: {
      store_id: params.store_id,
      language: params.language || "en",
      target_currency: params.target_currency || "USD",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<StoreDetails>(options);
    return response.data;
  } catch (error) {
    console.error("API Call Failed:", error);
    return null;
  }
}
