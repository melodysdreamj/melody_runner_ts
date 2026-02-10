import axios from "axios";

// 1. Interfaces
export interface SearchHotProductsParams {
  category_id?: string;
  page_no?: number;
  page_size?: number;
  target_currency?: string;
  language?: string;
  target_country?: string;
}

export interface HotProduct {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  app_sale_price: string;
  original_price: string;
  discount: string;
  sales_volume: string;
  product_detail_url: string;
  shop_url: string;
  shop_id: string;
}

export interface SearchHotProductsResponse {
  total_results: number;
  products: HotProduct[];
}

// 2. Main Function
export async function searchHotProducts(
  params: SearchHotProductsParams
): Promise<SearchHotProductsResponse | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/hot-products-download",
    params: {
      category_id: params.category_id,
      page_no: params.page_no || 1,
      page_size: params.page_size || 20,
      target_currency: params.target_currency || "USD",
      language: params.language || "en",
      target_country: params.target_country || "US",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<SearchHotProductsResponse>(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "API Call Failed:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected Error:", error);
    }
    return null;
  }
}
