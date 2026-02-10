import axios from "axios";

export interface GetProductDetailsParams {
  product_id: string;
  target_currency?: string;
  target_country?: string;
  language?: string;
}

export interface ProductDetails {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  product_images: string[];
  product_video_url?: string;
  keywords?: string;

  // Pricing
  original_price: string;
  sale_price: string;
  currency: string;
  discount: string;

  // Stats
  orders: number;
  review_rating: number; // 0-5
  total_reviews: number;

  // Store Info
  store_id: string;
  store_name: string;
  store_url: string;

  // Description (HTML or Text)
  description?: string;
  specifications?: Record<string, string>;
}

export async function getProductDetails(
  params: GetProductDetailsParams
): Promise<ProductDetails | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/product-details", // Based on KI
    params: {
      product_id: params.product_id,
      target_currency: params.target_currency || "USD",
      target_country: params.target_country || "US",
      language: params.language || "en",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<ProductDetails>(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Call Failed:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return null;
  }
}
