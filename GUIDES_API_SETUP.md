# Guides API Setup Documentation

## Overview
This implementation uses React Query to fetch categories and guides from your NestJS MongoDB API, and displays HTML content in a WebView.

## Features
- Browse guides by category
- View guide details with HTML content rendered in WebView
- Pull-to-refresh functionality
- Loading states and error handling
- Offline support with React Query caching
- Support for sub-categories

## API Endpoints (from Swagger)

Based on your NestJS MongoDB API Swagger documentation:

### Categories
- **GET /categories** - List all active categories
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Events",
      "description": "All event-related guides",
      "parentCategory": null,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "__v": 0
    }
  ]
  ```

- **GET /categories/:id** - Get a single category
  ```json
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Events",
    "description": "All event-related guides",
    "parentCategory": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

- **GET /categories/:id/subcategories** - Get sub-categories of a parent category
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Weekly Events",
      "description": "Weekly recurring events",
      "parentCategory": "507f1f77bcf86cd799439011",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

### Guides
- **GET /guides** - List all active guides
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "How to participate in events",
      "htmlContent": "<h1>Event Guide</h1><p>Follow these steps...</p>",
      "category": "507f1f77bcf86cd799439011",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "__v": 0
    }
  ]
  ```

- **GET /guides/:id** - Get a single guide with full HTML content
  ```json
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "How to participate in events",
    "htmlContent": "<h1>Event Guide</h1><p>Complete guide content here...</p>",
    "category": "507f1f77bcf86cd799439011",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

- **GET /guides/category/:categoryId** - Get all guides for a specific category
  ```json
  [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "How to participate in events",
      "htmlContent": "<h1>Event Guide</h1><p>Guide content...</p>",
      "category": "507f1f77bcf86cd799439011",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

## Configuration

### 1. Environment Setup
Create a `.env` file in the root directory:

```bash
ONESIGNAL_APP_ID=your-onesignal-app-id-here
API_BASE_URL=http://localhost:3000
```

**Important Notes:**
- The base URL should NOT include `/api` - it's just `http://localhost:3000`
- For Android emulator, use: `API_BASE_URL=http://10.0.2.2:3000`
- For iOS simulator: `API_BASE_URL=http://localhost:3000`
- For physical devices, use your computer's IP: `API_BASE_URL=http://192.168.1.XXX:3000`

### 2. API Configuration
The API endpoints are already configured in [src/config/api.ts](src/config/api.ts):

```typescript
export const API_CONFIG = {
  BASE_URL: API_BASE_URL || 'http://localhost:3000',
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
```

### 3. Data Models
The implementation uses MongoDB document structure with `_id` fields:

```typescript
// Category Schema
interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Guide Schema
interface Guide {
  _id: string;
  title: string;
  htmlContent: string;  // Note: uses htmlContent, not content
  category: string;     // Category ID reference
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
```

## Navigation Flow

1. **Guides Screen** ([GuidesScreen.tsx](src/screens/GuidesScreen.tsx))
   - User taps "📚 Browse All Guides" button

2. **Categories List Screen** ([CategoriesListScreen.tsx](src/screens/CategoriesListScreen.tsx))
   - Fetches and displays all categories from `GET /categories`
   - User taps a category card

3. **Category Guides Screen** ([CategoryGuidesScreen.tsx](src/screens/CategoryGuidesScreen.tsx))
   - Fetches guides for selected category from `GET /guides/category/:categoryId`
   - User taps a guide

4. **Guide Detail Screen** ([GuideDetailScreen.tsx](src/screens/GuideDetailScreen.tsx))
   - Fetches guide details from `GET /guides/:id`
   - Renders `htmlContent` in a styled WebView

## File Structure

```
src/
├── config/
│   ├── api.ts              # API endpoints configuration
│   └── queryClient.ts      # React Query client setup
├── hooks/
│   └── useApi.ts           # React Query hooks
├── screens/
│   ├── CategoriesListScreen.tsx
│   ├── CategoryGuidesScreen.tsx
│   └── GuideDetailScreen.tsx
├── services/
│   └── api.ts              # API service layer with fetch methods
└── types/
    ├── api.ts              # MongoDB schema types
    └── navigation.ts       # Navigation parameter types
```

## Usage Examples

### Fetching All Categories
```typescript
import { useCategories } from '../hooks/useApi';

const { data: categories, isLoading, error, refetch } = useCategories();
// categories is Category[]
```

### Fetching Guides by Category
```typescript
import { useGuidesByCategory } from '../hooks/useApi';

const { data: guides } = useGuidesByCategory(categoryId);
// guides is Guide[]
```

### Fetching Single Guide
```typescript
import { useGuide } from '../hooks/useApi';

const { data: guide } = useGuide(guideId);
// guide.htmlContent contains the HTML string
```

### Fetching Sub-Categories
```typescript
import { useSubCategories } from '../hooks/useApi';

const { data: subCategories } = useSubCategories(parentCategoryId);
// subCategories is Category[]
```

## HTML Content in WebView

The [GuideDetailScreen.tsx](src/screens/GuideDetailScreen.tsx) automatically styles HTML content with:
- Responsive design for mobile devices
- Theme-aware colors (matches app theme)
- Proper typography and spacing
- Support for:
  - Headings (h1-h6)
  - Paragraphs and text formatting
  - Images (auto-resize to fit screen)
  - Lists (ordered and unordered)
  - Code blocks with syntax highlighting
  - Tables with borders
  - Blockquotes
  - Links

The HTML content is wrapped in a template that includes:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>/* Theme-aware styles */</style>
  </head>
  <body>
    ${guide.htmlContent}
  </body>
</html>
```

## Testing Your API

### 1. Start Your NestJS API Server
```bash
cd your-api-directory
npm run start:dev
```

### 2. Verify Endpoints
```bash
# Test categories endpoint
curl http://localhost:3000/categories

# Test guides endpoint
curl http://localhost:3000/guides

# Test guides by category
curl http://localhost:3000/guides/category/YOUR_CATEGORY_ID

# Test single guide
curl http://localhost:3000/guides/YOUR_GUIDE_ID
```

### 3. Create Test Data
Use your API to create at least one category and one guide:

```bash
# Create a category
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Events",
    "description": "Event guides for WOS"
  }'

# Create a guide (use the category ID from above)
curl -X POST http://localhost:3000/guides \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Win Events",
    "htmlContent": "<h1>Event Strategy</h1><p>Follow these tips to win events...</p>",
    "category": "YOUR_CATEGORY_ID_HERE"
  }'
```

### 4. Run the React Native App
```bash
# Install dependencies if not done already
npm install

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Troubleshooting

### Network Request Failed
- **Android Emulator**: Use `API_BASE_URL=http://10.0.2.2:3000` (not localhost)
- **iOS Simulator**: Use `API_BASE_URL=http://localhost:3000`
- **Physical Device**: Use your computer's local IP (e.g., `http://192.168.1.100:3000`)
- Ensure your API is running and accessible
- Check that there's no firewall blocking the connection

### Empty Categories/Guides List
- Verify data exists in your MongoDB database
- Check that `isActive: true` is set on your documents
- Use browser or Postman to test API endpoints directly
- Check API logs for errors

### WebView Not Displaying Content
- Verify `guide.htmlContent` contains valid HTML
- Check browser console for JavaScript errors (enable remote debugging)
- Ensure WebView permissions are set in AndroidManifest.xml
- Test HTML content in a regular browser first

### TypeScript Errors
If you see type errors:
- Make sure you're using `_id` (not `id`) for document IDs
- Use `htmlContent` (not `content`) for guide HTML
- Check that types in [src/types/api.ts](src/types/api.ts) match your API responses

### MongoDB ID Format
MongoDB uses ObjectId strings like `"507f1f77bcf86cd799439011"`. Make sure:
- All navigation params use `string` type (not `number`)
- You're passing the full `_id` value, not truncating it
- Category references in guides use the full MongoDB ObjectId

## Next Steps

1. ✅ Create a `.env` file with your `API_BASE_URL`
2. ✅ Start your NestJS API server
3. ✅ Create test categories and guides via API
4. ✅ Run the React Native app
5. ✅ Navigate: Guides → Browse All Guides → Select Category → Select Guide
6. 🎨 Customize styling in screen components as needed
7. 🔧 Add more features like search, favorites, etc.

## API Documentation Reference

For complete API documentation, visit your Swagger UI at:
```
http://localhost:3000/api#/
```

This shows all available endpoints, request/response schemas, and allows you to test the API directly.
