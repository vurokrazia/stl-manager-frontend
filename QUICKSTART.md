# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8081`

## Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

That's it! Frontend will be available at `http://localhost:3000`

## First Time Setup

The `.env` file is already configured with default values:
```
VITE_API_BASE_URL=http://localhost:8081/v1
VITE_API_KEY=dev-secret-key
```

If your backend is running on a different port or you changed the API key, edit `.env` accordingly.

## Project Structure Overview

```
src/
├── components/
│   ├── common/          # Reusable components (StatCard)
│   └── layout/          # Layout (MainLayout with sidebar)
├── pages/
│   ├── Dashboard/       # Home page with stats
│   └── Files/           # Files listing with search/filters
├── repositories/        # API calls (Repository Pattern)
│   ├── files.repository.ts
│   ├── scans.repository.ts
│   └── categories.repository.ts
├── hooks/               # React Query hooks
│   ├── useFiles.ts
│   ├── useScans.ts
│   └── useCategories.ts
├── services/            # HTTP client (Axios)
├── types/               # TypeScript types
├── utils/               # Helper functions
└── config/              # Configuration
```

## Key Features

1. **Dashboard** (`/`) - Overview with statistics
2. **Files** (`/files`) - Browse, search, and filter files
3. **Scan Button** (Header) - Trigger file scan
4. **Reclassify** (Files page) - Re-run AI classification

## Troubleshooting

### "Cannot connect to API"
- Make sure backend is running: `go run cmd/api/main.go` in backend folder
- Check that port 8081 is not blocked
- Verify `.env` has correct `VITE_API_BASE_URL`

### "Dependencies not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
Edit `vite.config.ts` and change the port:
```typescript
server: {
  port: 3001, // Change this
}
```

## Next Steps

- Run a scan from the header button
- Browse files in the Files page
- Use search and filters
- Click "Reclassify" to re-run AI classification on a file

Enjoy! 🚀
