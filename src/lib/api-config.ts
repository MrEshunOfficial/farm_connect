export const API_CONFIG = {
  baseUrl: 'https://category-api-iota.vercel.app/api',
  endpoints: {
    categories: '/productcategoryapi',
    regions: '/regions'
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
} as const;