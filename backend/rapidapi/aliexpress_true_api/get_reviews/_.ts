import axios from "axios";

export interface GetReviewsParams {
  product_id: string;
  page?: number;
  page_size?: number;
  filter?: "all" | "with_image" | "with_text" | "with_video";
  sort?: "default" | "date_desc";
  language?: string;
  target_country?: string;
}

export interface Review {
  review_id: string;
  buyer_name: string;
  buyer_country: string;
  rating: number; // 1-5
  content: string;
  images: string[];
  created_at: string;
  sku_info?: string;
}

export interface ReviewsResponse {
  total_results: number;
  page: number;
  total_pages: number;
  reviews: Review[];
}

export async function getReviews(
  params: GetReviewsParams
): Promise<ReviewsResponse | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/reviews",
    params: {
      product_id: params.product_id,
      page: params.page || 1,
      page_size: params.page_size || 20,
      filter: params.filter || "all",
      sort: params.sort || "default",
      language: params.language || "en",
      target_country: params.target_country || "US",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<ReviewsResponse>(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        // Log silently or specific handling
        console.error("API Error in getReviews:", error.message);
    }
    throw error;
  }
}
