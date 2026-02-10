import axios from "axios";

export interface SearchProductsParams {
  search_query: string;
  page?: number;
  sort?: "default" | "price_asc" | "price_desc" | "orders_desc";
  target_currency?: string;
  target_country?: string;
  min_price?: number;
  max_price?: number;
}

export interface ProductSummary {
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

export interface SearchProductsResponse {
  total_results: number;
  page: number;
  total_pages: number;
  products: ProductSummary[];
}

export async function searchProducts(
  params: SearchProductsParams
): Promise<SearchProductsResponse | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/search",
    params: {
      search_query: params.search_query,
      page: params.page || 1,
      sort: params.sort || "default",
      target_currency: params.target_currency || "USD",
      target_country: params.target_country || "US",
      min_price: params.min_price,
      max_price: params.max_price,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<SearchProductsResponse>(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Call Failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
}
