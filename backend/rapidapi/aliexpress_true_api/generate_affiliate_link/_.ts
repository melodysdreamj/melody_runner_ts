import axios from "axios";

// 1. Interfaces
export interface GenerateAffiliateLinkParams {
  url: string; // The original product or page URL
  promotion_link_type?: number; // Optional: 0 for normal, 1 for hot product, etc. (Depends on API)
}

export interface GenerateAffiliateLinkResponse {
  promotion_link: string;
}

// 2. Main Function
export async function generateAffiliateLink(
  params: GenerateAffiliateLinkParams
): Promise<GenerateAffiliateLinkResponse | null> {
  const options = {
    method: "GET",
    url: "https://aliexpress-true-api.p.rapidapi.com/affiliate-link-generate", // Estimated Endpoint
    params: {
      url: params.url,
      promotion_link_type: params.promotion_link_type || 0,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "aliexpress-true-api.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request<GenerateAffiliateLinkResponse>(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        // Log more details if available
        console.error("API Call Failed:", error.response?.data || error.message);
    } else {
        console.error("Unexpected Error:", error);
    }
    throw error;
  }
}
