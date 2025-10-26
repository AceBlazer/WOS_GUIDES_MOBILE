import { NativeConfig } from './nativeConfig';

// API Configuration based on Swagger documentation
export const API_CONFIG = {
  BASE_URL: NativeConfig.API_BASE_URL,
  ENDPOINTS: {
    // Categories
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
    SUBCATEGORIES: (id: string) => `/categories/${id}/subcategories`,

    // Guides
    GUIDES: '/guides',
    GUIDE_BY_ID: (id: string) => `/guides/${id}`,
    GUIDES_BY_CATEGORY: (categoryId: string) => `/guides/category/${categoryId}`,
  },
  TIMEOUT: 10000,
};
