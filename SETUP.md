# GoldBridge — Setup & Deployment Guide

## Prerequisites

- **Node.js** v18+ (recommended v20 LTS)
- **Docker** (for PostgreSQL, or use a managed database)
- **npm** (comes with Node.js)

---

## 1. Quick Start (Local Development)

### Step 1: Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### Step 2: Start PostgreSQL (Docker)

```bash
docker run -d \
  --name goldbridge_db \
  -e POSTGRES_DB=goldbridge_db \
  -e POSTGRES_USER=goldbridge \
  -e POSTGRES_PASSWORD=goldbridge_pass \
  -p 5432:5432 \
  postgres:16-alpine
```

### Step 3: Initialize Database

```bash
docker exec -i goldbridge_db psql -U goldbridge -d goldbridge_db < server/db/init.sql
```

### Step 4: Configure Environment Variables

Copy and edit the backend `.env` file:

```bash
cp server/.env.example server/.env
# Or edit server/.env directly
```

See [Environment Variables](#environment-variables) below for all required values.

### Step 5: Start Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

---

## 2. Environment Variables

All environment variables go in `server/.env`:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `PORT` | No | Backend server port | `5001` |
| `NODE_ENV` | No | `development` or `production` | `development` |
| `DB_HOST` | Yes | PostgreSQL host | `localhost` |
| `DB_PORT` | Yes | PostgreSQL port | `5432` |
| `DB_NAME` | Yes | Database name | `goldbridge_db` |
| `DB_USER` | Yes | Database user | `goldbridge` |
| `DB_PASSWORD` | Yes | Database password | `goldbridge_pass` |
| `JWT_SECRET` | Yes | Secret for access tokens (use a long random string) | — |
| `JWT_REFRESH_SECRET` | Yes | Secret for refresh tokens (different from JWT_SECRET) | — |
| `JWT_EXPIRES_IN` | No | Access token expiry | `24h` |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token expiry | `7d` |
| `API_TOKEN` | Yes | RapidAPI key for gold/silver rates | — |
| `GOOGLE_CLIENT_ID` | No* | Google OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | No* | Google OAuth client secret | — |
| `GOOGLE_CALLBACK_URL` | No* | Google OAuth callback URL | `http://localhost:5001/api/v1/auth/google/callback` |
| `FRONTEND_URL` | No | Frontend URL (for OAuth redirects & CORS) | `http://localhost:5173` |

> *Google OAuth variables are optional but required for social login to work.

---

## 3. Google OAuth 2.0 Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API** or **Google People API**

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Choose **Web application**
4. Set **Authorized JavaScript origins**:
   - `http://localhost:5173` (dev)
   - `https://yourdomain.com` (production)
5. Set **Authorized redirect URIs**:
   - `http://localhost:5001/api/v1/auth/google/callback` (dev)
   - `https://yourdomain.com/api/v1/auth/google/callback` (production)
6. Copy the **Client ID** and **Client Secret** to your `.env` file

### Step 3: Configure Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Set app name to "GoldBridge"
3. Add your domain as an authorized domain
4. Add scopes: `email`, `profile`, `openid`
5. Publish to production when ready

---

## 4. Adding More OAuth Providers (Future)

### Facebook Login

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app → **Consumer** type
3. Add **Facebook Login** product
4. Set redirect URI: `https://yourdomain.com/api/v1/auth/facebook/callback`
5. Get App ID and App Secret
6. Add backend routes similar to Google OAuth pattern

### X (Twitter) Login

1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app with OAuth 2.0 enabled
3. Set callback URL: `https://yourdomain.com/api/v1/auth/twitter/callback`
4. Get Client ID and Client Secret
5. Implement OAuth 2.0 PKCE flow

### GitHub Login

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `https://yourdomain.com/api/v1/auth/github/callback`
4. Get Client ID and Client Secret

---

## 5. Production Build

```bash
# Build the frontend
npm run build

# The built files will be in ./dist/
# The backend automatically serves them in production mode

# Start production server
cd server
NODE_ENV=production node index.js
```

---

## 6. Deployment Options

### Option A: Railway

1. Connect your GitHub repo to [Railway](https://railway.app)
2. Add a **PostgreSQL** database service
3. Configure environment variables in Railway dashboard
4. Set build command: `npm install && npm run build && cd server && npm install`
5. Set start command: `cd server && NODE_ENV=production node index.js`
6. Set root directory: `/`

### Option B: Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Add a **PostgreSQL** database
3. Set build command: `npm install && npm run build && cd server && npm install`
4. Set start command: `cd server && NODE_ENV=production node index.js`
5. Add all env variables

### Option C: VPS / DigitalOcean

```bash
# On your server
git clone <your-repo>
cd goldbridge

# Install & build
npm install
npm run build
cd server && npm install

# Run with PM2
npm install -g pm2
NODE_ENV=production pm2 start index.js --name goldbridge-api

# Set up Nginx reverse proxy
# Proxy pass to localhost:5001
```

---

## 7. Database Management

### Re-initialize Database

```bash
docker exec -i goldbridge_db psql -U goldbridge -d goldbridge_db < server/db/init.sql
```

### Backup Database

```bash
docker exec goldbridge_db pg_dump -U goldbridge goldbridge_db > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker exec -i goldbridge_db psql -U goldbridge -d goldbridge_db < backup_20240624.sql
```

---

## 8. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/v1/auth/register` | No | Register new user |
| POST | `/api/v1/auth/login` | No | Login |
| POST | `/api/v1/auth/refresh` | No | Refresh JWT token |
| GET | `/api/v1/auth/google` | No | Start Google OAuth |
| GET | `/api/v1/users/me` | Yes | Get current user |
| GET | `/api/v1/rates/live` | No | Live gold/silver rates |
| GET | `/api/v1/rates/history` | No | Rate trend (30 days) |
| GET | `/api/v1/dashboard/summary` | Yes | Dashboard stats |
| GET | `/api/v1/dashboard/charts` | Yes | Dashboard chart data |
| GET | `/api/v1/dashboard/recent-orders` | Yes | Recent orders |
| CRUD | `/api/v1/inventory` | Yes | Inventory management |
| CRUD | `/api/v1/sales/orders` | Yes | Sales orders |
| CRUD | `/api/v1/customers` | Yes | Customer management |
| CRUD | `/api/v1/purchases` | Yes | Purchase management |
| CRUD | `/api/v1/manufacturing` | Yes | Manufacturing jobs |
| CRUD | `/api/v1/invoices` | Yes | Invoice management |
| GET | `/api/v1/reports/*` | Yes | Reports (sales/stock/gst/profit) |
| GET/PUT | `/api/v1/settings` | Yes | Business settings |

---

## 9. Troubleshooting

### "Bad Gateway" or Backend Won't Start
- Check PostgreSQL is running: `docker ps | grep goldbridge`
- Check `.env` database credentials match Docker configuration
- Check port 5001 is free: `lsof -i :5001`

### OAuth "redirect_uri_mismatch"
- Ensure `GOOGLE_CALLBACK_URL` in `.env` exactly matches what's in Google Cloud Console
- Include both `http://localhost:5001/...` (dev) and production URL

### "Failed to fetch rates"
- Ensure `API_TOKEN` in `.env` is a valid RapidAPI key
- Check RapidAPI subscription is active at [rapidapi.com](https://rapidapi.com)

### Empty Dashboard Charts
- Dashboard shows real data from your database. Add inventory items and create sales orders to see charts populate.
