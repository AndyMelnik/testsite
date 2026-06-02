# Threadline — Clothing Store

A full-stack clothing e-commerce app with an Express backend and a React frontend. All UI text is in English.

## Project Structure

```
testsite/
├── backend/          # Express REST API
├── frontend/         # React + Vite storefront (Express server in production)
├── render.yaml       # Render Blueprint (two Web Services)
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

The app uses **two Web Services** on Render:

| Service | Type | Purpose |
|---------|------|---------|
| `threadline-store` | Web Service | React frontend served by Express |
| `threadline-api` | Web Service | Express API |

### Option A — Blueprint (recommended)

1. Push the repo to GitHub (see above).
2. In [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect your GitHub repository.
4. Render reads `render.yaml` and creates both services automatically.
5. After the first deploy finishes, click **Manual Deploy → Deploy latest commit** once more if the storefront was built before the API URL was available.

The Blueprint wires environment variables automatically:

- `VITE_API_URL` on the storefront → API public URL (used at build time)
- `FRONTEND_URL` on the API → storefront public URL (for CORS)

### Option B — Manual setup

#### 1. Deploy the API (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your storefront URL (add after step 2) |

#### 2. Deploy the storefront (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Runtime | Node |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `https://your-api-name.onrender.com` (no trailing slash) |

The Express server in `frontend/server.js` serves the built React app and handles SPA routing — no redirect rules needed.

#### 3. Update CORS on the API

Go back to the API service and set `FRONTEND_URL` to your storefront URL, then redeploy the API.

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
- **Hosting:** Render.com (two Web Services)

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
