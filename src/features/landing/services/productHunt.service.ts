import { ProductHuntPost } from '../types/product-hunt';
import { PRODUCT_HUNT_CONFIG } from '../constants/product-hunt';

export interface FetchProductHuntResult {
  post: ProductHuntPost | null;
  isAvailable: boolean;
  error?: string;
}

export async function fetchProductHuntData(): Promise<FetchProductHuntResult> {
  try {
    if (!PRODUCT_HUNT_CONFIG.slug || !PRODUCT_HUNT_CONFIG.apiEndpoint) {
      return { post: null, isAvailable: false };
    }

    const response = await fetch(PRODUCT_HUNT_CONFIG.apiEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return { post: null, isAvailable: false, error: 'Product Hunt API returned non-OK status' };
    }

    const data = (await response.json()) as { post?: ProductHuntPost };
    if (!data || !data.post || !data.post.id || typeof data.post.votesCount !== 'number') {
      return { post: null, isAvailable: false };
    }

    return {
      post: data.post,
      isAvailable: true,
    };
  } catch (error) {
    return {
      post: null,
      isAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown network error',
    };
  }
}
