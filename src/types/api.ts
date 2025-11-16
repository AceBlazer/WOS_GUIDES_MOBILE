// API Types based on Swagger documentation

// Localized text object supporting multiple languages
export interface LocalizedText {
  en?: string;
  fr?: string;
  ar?: string;
  it?: string;
  de?: string;
  zh?: string;
  ru?: string;
}

// Category Schema
export interface Category {
  _id: string;
  name: LocalizedText | string; // Support both new and old format
  description?: string;
  parentCategory?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Guide Schema
export interface Guide {
  _id: string;
  title: LocalizedText | string; // Support both new and old format
  htmlContent: string;
  category: string; // Category ID reference
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Populated Guide (with category details)
export interface GuideWithCategory extends Omit<Guide, 'category'> {
  category: Category;
}

// DTO Types
export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentCategory?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentCategory?: string;
  isActive?: boolean;
}

export interface CreateGuideDto {
  title: string;
  htmlContent: string;
  category: string;
}

export interface UpdateGuideDto {
  title?: string;
  htmlContent?: string;
  category?: string;
  isActive?: boolean;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

// API Error
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}
