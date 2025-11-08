# STL Manager - Frontend

Professional React + TypeScript frontend for managing 3D print files with Ant Design.

## Features

- 🎨 **Modern UI** - Ant Design components
- 📊 **Dashboard** - Statistics and overview
- 🔍 **Advanced Search** - Fuzzy search and filters
- 🏷️ **Categories** - Tag-based organization
- ⚡ **Fast** - React Query for caching
- 📱 **Responsive** - Mobile-friendly design
- 🎯 **TypeScript** - Type-safe development

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Generic components (StatCard, etc.)
│   └── layout/      # Layout components (MainLayout)
├── pages/           # Page components
│   ├── Dashboard/   # Dashboard page
│   └── Files/       # Files listing page
├── services/        # HTTP client (Axios)
├── repositories/    # Data access layer (Repository Pattern)
├── hooks/           # Custom React hooks (React Query)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── config/          # Configuration files
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Ant Design 5** - UI components
- **React Router** - Routing
- **React Query** - Server state management
- **Axios** - HTTP client

## Design Patterns

### 1. Repository Pattern
Separates data access logic from business logic:
```typescript
// repositories/files.repository.ts
export class FilesRepository {
  async getFiles(filters) { ... }
  async getFileById(id) { ... }
}
```

### 2. Custom Hooks
Encapsulates data fetching logic:
```typescript
// hooks/useFiles.ts
export function useFiles(filters) {
  return useQuery({
    queryKey: ['files', filters],
    queryFn: () => filesRepository.getFiles(filters),
  });
}
```

### 3. Service Layer
HTTP client configuration:
```typescript
// services/http.service.ts
class HttpService {
  private client: AxiosInstance;
  // Interceptors, error handling, etc.
}
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8081/v1
VITE_API_KEY=dev-secret-key
```

### 3. Run development server

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 4. Build for production

```bash
npm run build
```

## Development

### File Structure

- **Components**: Reusable UI pieces
- **Pages**: Route-level components
- **Repositories**: API calls abstraction
- **Hooks**: React Query integration
- **Utils**: Helper functions

### Adding a New Feature

1. **Define types** in `types/models.ts`
2. **Create repository** in `repositories/`
3. **Create custom hook** in `hooks/`
4. **Build UI component** in `components/` or `pages/`

Example:
```typescript
// 1. Type
export interface NewFeature {
  id: string;
  name: string;
}

// 2. Repository
export class NewFeatureRepository {
  async get() { return httpService.get('/endpoint'); }
}

// 3. Hook
export function useNewFeature() {
  return useQuery({
    queryKey: ['newFeature'],
    queryFn: () => repository.get(),
  });
}

// 4. Component
const Component = () => {
  const { data } = useNewFeature();
  return <div>{data?.name}</div>;
}
```

## API Integration

The frontend communicates with the Go backend API:

```typescript
// Configured in config/api.ts
export const API_CONFIG = {
  baseURL: 'http://localhost:8081/v1',
  apiKey: 'dev-secret-key',
};
```

All requests include the `X-API-Key` header automatically.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Features Roadmap

- [x] Dashboard with statistics
- [x] Files listing with filters
- [x] Search functionality
- [x] Category filtering
- [x] File reclassification
- [ ] File details drawer
- [ ] 3D preview for STL files
- [ ] Bulk operations
- [ ] Dark mode
- [ ] Export to CSV
- [ ] Drag & drop organization

## Contributing

This project follows:
- **Clean Architecture** principles
- **SOLID** principles
- **Repository Pattern** for data access
- **Custom Hooks** for business logic
- **TypeScript** for type safety

## License

MIT
