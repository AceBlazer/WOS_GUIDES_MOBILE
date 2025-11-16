import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Category, Guide } from '../types/api';

// Query Keys
export const queryKeys = {
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  subCategories: (parentId: string) => ['categories', parentId, 'subcategories'] as const,
  guides: ['guides'] as const,
  guide: (id: string) => ['guides', id] as const,
  guidesByCategory: (categoryId: string) => ['guides', 'category', categoryId] as const,
  searchGuides: (query: string) => ['guides', 'search', query] as const,
};

// Categories Hooks
export const useCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Category[], Error>({
    queryKey: queryKeys.categories,
    queryFn: () => apiService.getCategories(),
    ...options,
  });
};

export const useCategory = (
  id: string,
  options?: Omit<UseQueryOptions<Category, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Category, Error>({
    queryKey: queryKeys.category(id),
    queryFn: () => apiService.getCategory(id),
    enabled: !!id,
    ...options,
  });
};

export const useSubCategories = (
  parentId: string,
  options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Category[], Error>({
    queryKey: queryKeys.subCategories(parentId),
    queryFn: () => apiService.getSubCategories(parentId),
    enabled: !!parentId,
    ...options,
  });
};

// Guides Hooks
export const useGuides = (
  options?: Omit<UseQueryOptions<Guide[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Guide[], Error>({
    queryKey: queryKeys.guides,
    queryFn: () => apiService.getGuides(),
    ...options,
  });
};

export const useGuide = (
  id: string,
  options?: Omit<UseQueryOptions<Guide, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Guide, Error>({
    queryKey: queryKeys.guide(id),
    queryFn: () => apiService.getGuide(id),
    enabled: !!id,
    ...options,
  });
};

export const useGuidesByCategory = (
  categoryId: string,
  options?: Omit<UseQueryOptions<Guide[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Guide[], Error>({
    queryKey: queryKeys.guidesByCategory(categoryId),
    queryFn: () => apiService.getGuidesByCategory(categoryId),
    enabled: !!categoryId,
    ...options,
  });
};

export const useSearchGuides = (
  query: string,
  options?: Omit<UseQueryOptions<Guide[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Guide[], Error>({
    queryKey: queryKeys.searchGuides(query),
    queryFn: () => apiService.searchGuides(query),
    enabled: !!query && query.length > 0,
    ...options,
  });
};
