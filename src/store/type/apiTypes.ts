// types.ts
export interface Category {
  id: string | number;
  name: string;
  subcategories?: {
    id: string | number;
    name: string;
  }[];
}

export interface Region {
  region: string;
  cities: string[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
