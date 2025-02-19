export const API_CONFIG = {
  baseUrl: 'https://category-api-k33a.vercel.app/api',
  endpoints: {
    categories: '/productcategoryapi',
    regions: '/regions'
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
} as const;