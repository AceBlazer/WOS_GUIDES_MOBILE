import { API_CONFIG } from '../config/api';
import type { Category, Guide, ApiError, ApiResponse } from '../types/api';
import i18n from '../i18n';

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async fetchWithTimeout(
    url: string,
    options?: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Language': i18n.language || 'en',
          ...options?.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // API returns wrapped response: { success: true, count: X, data: [...] }
    if (json.data !== undefined) {
      return json.data as T;
    }

    // Fallback for unwrapped responses
    return json as T;
  }

  // Categories endpoints
  async getCategories(): Promise<Category[]> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.CATEGORIES}`
    );
    return this.handleResponse<Category[]>(response);
  }

  async getCategory(id: string): Promise<Category> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.CATEGORY_BY_ID(id)}`
    );
    return this.handleResponse<Category>(response);
  }

  async getSubCategories(parentId: string): Promise<Category[]> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.SUBCATEGORIES(parentId)}`
    );
    return this.handleResponse<Category[]>(response);
  }

  // Guides endpoints
  async getGuides(): Promise<Guide[]> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.GUIDES}`
    );
    return this.handleResponse<Guide[]>(response);
  }

  async getGuide(id: string): Promise<Guide> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.GUIDE_BY_ID(id)}`
    );
    return this.handleResponse<Guide>(response);
  }

  async getGuidesByCategory(categoryId: string): Promise<Guide[]> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.GUIDES_BY_CATEGORY(categoryId)}`
    );
    return this.handleResponse<Guide[]>(response);
  }
}

export const apiService = new ApiService();
