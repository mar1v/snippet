# 📦 Snippet Vault

A minimal full-stack app for storing useful snippets — links, notes, and commands — with tagging, search, and pagination.

**Stack:** Next.js 14 (App Router) · NestJS 10 · MongoDB (Mongoose) · TypeScript · Tailwind CSS

---

## 🗂 Project Structure

```
snippet-vault/
├── backend/     # NestJS API
└── frontend/    # Next.js App
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Backend (NestJS)

```bash
cd backend

# Install dependencies
npm install

# Copy and fill env variables
cp .env.example .env

# Start in dev mode
npm run start:dev
# → API available at http://localhost:3001/api
```

**`.env` for backend:**
```env
MONGODB_URI=mongodb://localhost:27017/snippet-vault
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

### 2. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill env variables
cp .env.example .env.local

# Start in dev mode
npm run dev
# → App available at http://localhost:3000
```

**`.env.local` for frontend:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🔨 Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

---

## 🔌 API Reference

Base URL: `http://localhost:3001/api`

### Snippets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/snippets` | List all snippets (paginated) |
| `POST` | `/snippets` | Create a new snippet |
| `GET` | `/snippets/tags` | Get all unique tags |
| `GET` | `/snippets/:id` | Get snippet by ID |
| `PUT` | `/snippets/:id` | Update snippet |
| `DELETE` | `/snippets/:id` | Delete snippet |

### Query Parameters for `GET /snippets`

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Full-text search by title/content |
| `tag` | string | Filter by tag |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

### Example Requests

```bash
# Get all snippets
curl http://localhost:3001/api/snippets

# Search snippets
curl "http://localhost:3001/api/snippets?q=docker&page=1&limit=10"

# Filter by tag
curl "http://localhost:3001/api/snippets?tag=devops"

# Create snippet
curl -X POST http://localhost:3001/api/snippets \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker cleanup","content":"docker system prune -af","tags":["docker","devops"],"type":"command"}'

# Update snippet
curl -X PUT http://localhost:3001/api/snippets/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'

# Delete snippet
curl -X DELETE http://localhost:3001/api/snippets/<id>

# Get all tags
curl http://localhost:3001/api/snippets/tags
```

### Error Responses

- `400 Bad Request` — validation errors or invalid ID format
- `404 Not Found` — snippet with given ID does not exist

```json
{
  "statusCode": 404,
  "message": "Snippet with ID 123 not found",
  "error": "Not Found"
}
```

---

## 🌐 Features

- ✅ Full CRUD for Snippets
- ✅ Three snippet types: `link`, `note`, `command`
- ✅ Tag-based filtering
- ✅ Full-text search (MongoDB text index on `title` + `content`)
- ✅ Pagination (page/limit)
- ✅ DTO validation via `class-validator`
- ✅ Proper 400/404 error handling
- ✅ Loading / empty / error UI states
- ✅ Responsive dark-mode interface

---

## 📌 What I Didn't Have Time For / Would Add Next

- **Unit & e2e tests** — would add Jest tests for the NestJS service layer and Playwright e2e for critical flows
- **Optimistic UI updates** — currently the list re-fetches after delete; would do client-side removal first
- **Tag autocomplete** — suggest existing tags while typing in the form
- **Bulk operations** — select multiple snippets to delete or re-tag
- **Vercel/Railway deploy** — would deploy frontend to Vercel and backend + MongoDB Atlas via Railway with proper env config

---

## 🔗 Live Demo

> _Deploy link goes here (e.g. https://snippet-vault.vercel.app)_
