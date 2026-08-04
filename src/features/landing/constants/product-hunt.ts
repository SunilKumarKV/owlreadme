export const PRODUCT_HUNT_CONFIG = {
  slug: process.env.NEXT_PUBLIC_PRODUCT_HUNT_SLUG || 'owlreadme',
  postUrl: process.env.NEXT_PUBLIC_PRODUCT_HUNT_URL || 'https://www.producthunt.com/posts/owlreadme',
  apiEndpoint: process.env.NEXT_PUBLIC_PRODUCT_HUNT_API_URL || '/api/product-hunt',
} as const;
