import { API_CONFIG } from '@/lib/api-config';
import { ApiResponse, Category, Region } from '@/store/type/apiTypes';

// api-service.ts
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private async fetchWithError<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: API_CONFIG.headers,
        mode: 'cors',
        credentials: 'omit',
        ...options
      });

      if (!response.ok) {
        throw new ApiError(
          'API request failed',
          response.status,
          response.statusText
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.fetchWithError<Category[]>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.categories}`
    );
  }

  async getRegions(): Promise<Region[]> {
    const response = await this.fetchWithError<ApiResponse<Region[]>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.regions}`
    );
    
    if (!response.data) {
      throw new ApiError('No regions data available');
    }
    
    return response.data;
  }
}

