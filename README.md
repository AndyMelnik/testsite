# Threadline — Clothing Store

A full-stack clothing e-commerce app with an Express backend and a React frontend. All UI text is in English.

## Project Structure

```
testsite/
├── backend/          # Express REST API
├── frontend/         # React + Vite storefront (Express server in production)
├── render.yaml       # Render Blueprint (single Web Service)
└── package.json      # Local dev scripts
```

## Features

- Product catalog with categories (Men, Women, Accessories)
- Product search and category filters
- Product detail pages with size and color selection
- Shopping cart with checkout flow
- Order creation API

## Local Development

Install dependencies:

```bash
npm run install:all
```

Run backend and frontend together:

```bash
npm run dev
```

Open the storefront:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/health

In local dev, the frontend uses Vite's proxy (`/api` → `localhost:3001`). No `.env` file is required.

Test the production frontend server locally:

```bash
cd frontend
npm run build
VITE_API_URL=http://localhost:3001 npm start
```

## Deploy to GitHub

This project is meant to live in its **own GitHub repository** (not inside a larger monorepo).

```bash
cd testsite
git add .
git commit -m "Prepare Threadline store for Render deployment"
```

Create a new empty repository on GitHub, then push:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/threadline-store.git
git push -u origin main
```

## Deploy to Render.com

The app runs as **one Web Service** on Render — the backend serves both the API and the React frontend from the same URL.

| Setting | Value |
|---------|-------|
| **Root Directory** | *(leave empty — repo root)* |
| **Build Command** | `npm run build:render` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

Environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

No `VITE_API_URL` needed — the frontend uses `/api` on the same domain.

### Option A — Blueprint (recommended)

1. Push the repo to GitHub (see above).
2. In [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect your GitHub repository.
4. Render reads `render.yaml` and creates one Web Service automatically.

### Option B — Manual setup

**New + → Web Service → Connect `AndyMelnik/testsite`**

Use the settings from the table above. Click **Create Web Service**.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (`?category=`, `?featured=true`, `?search=`) |
| GET | `/api/products/categories` | List categories |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders/:id` | Get order by ID |

## Tech Stack

- **Backend:** Node.js 20+, Express, CORS
- **Frontend:** React 18, React Router, Vite, Express (production server)
- **Hosting:** Render.com (single Web Service)

## Environment Variables

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` for local production builds:

```bash
VITE_API_URL=https://threadline-api.onrender.com
```

Leave empty for local dev with Vite proxy.

### Backend

| Variable | Description |
|----------|-------------|
| `PORT` | Set automatically by Render |
| `FRONTEND_URL` | Storefront URL allowed by CORS |

## Notes

- Render free tier Web Services spin down after inactivity; the first request may take ~30 seconds.
- Product images use external Unsplash URLs — no image hosting needed.
- Orders are stored in memory on the API and reset when the service restarts. Add a database for production use.
