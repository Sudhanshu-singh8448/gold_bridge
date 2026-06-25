# GoldBridge ERP — Backend + Dashboard Pages Implementation

Full-stack implementation: Docker PostgreSQL, Node.js/Express backend with JWT auth, and all 9 missing dashboard pages.

---

## User Review Required

> [!IMPORTANT]
> **Docker**: PostgreSQL will run in a Docker container via `docker-compose.yml`. The Node.js backend will run locally (not in Docker) for development convenience. You need **Docker Desktop** installed.

> [!IMPORTANT]
> **JWT Auth**: Using `bcryptjs` for password hashing, `jsonwebtoken` for tokens. Access tokens expire in 24h. No refresh token rotation for simplicity.

> [!WARNING]
> **Frontend auth pages** (`LoginPage.jsx`, `RegisterPage.jsx`) will be modified to call real backend APIs instead of being static.

---

## Open Questions

> [!IMPORTANT]
> 1. **Port**: Backend will run on `:5000`. Frontend Vite dev server proxies `/api` to `:5000`. Does this work for your setup?
> 2. **Email**: Forgot-password will return a mock "reset link sent" response (no actual email service). Want real email (e.g., Nodemailer + SMTP)?

---

## Proposed Changes

### 1. Docker PostgreSQL Setup

#### [NEW] docker-compose.yml
- PostgreSQL 16 container with:
  - Port `5432` exposed
  - Database: `goldbridge_db`
  - User: `goldbridge` / Password: `goldbridge_pass`
  - Persistent volume for data

#### [NEW] Dockerfile (for Postgres initialization)
- Use official `postgres:16-alpine` image
- Init scripts to create the database schema on first run

---

### 2. Backend — Node.js/Express Server

#### [NEW] `server/` directory structure

```
server/
├── package.json
├── index.js              # Express server entry point
├── config/
│   └── db.js             # PostgreSQL connection pool (pg)
├── middleware/
│   └── auth.js           # JWT verification middleware
├── routes/
│   ├── auth.js           # POST /register, /login, /forgot-password
│   ├── dashboard.js      # GET /summary, /charts
│   ├── inventory.js      # CRUD /inventory
│   ├── sales.js          # CRUD /sales/orders
│   ├── customers.js      # CRUD /customers
│   ├── purchases.js      # CRUD /purchases
│   ├── manufacturing.js  # CRUD /manufacturing
│   ├── rates.js          # GET /rates/live, /rates/history
│   ├── reports.js        # GET /reports/*
│   ├── invoices.js       # CRUD /invoices
│   └── settings.js       # GET/PUT /settings
├── db/
│   └── init.sql          # Full schema: users, inventory, customers, orders, etc.
└── .env.example          # Environment variables template
```

#### Key Dependencies
- `express`, `cors`, `dotenv`
- `pg` (PostgreSQL client)
- `bcryptjs` (password hashing)
- `jsonwebtoken` (JWT)

#### Database Schema (init.sql)

| Table | Key Columns |
|-------|-------------|
| `users` | id, name, email, password_hash, phone, role, business_name, created_at |
| `inventory` | id, user_id, sku, name, category, weight, purity, status, barcode, making_charge, created_at |
| `customers` | id, user_id, name, phone, email, address, pan_number, loyalty_points, created_at |
| `sales_orders` | id, user_id, customer_id, items (JSONB), is_gst, cgst_rate, sgst_rate, discount, total_amount, payment_method, status, created_at |
| `purchases` | id, user_id, supplier_name, items (JSONB), total_amount, status, created_at |
| `manufacturing_jobs` | id, user_id, artisan_name, item_type, weight, purity, stage, wastage, due_date, created_at |
| `invoices` | id, user_id, order_id, invoice_number, template, total, gst_amount, created_at |
| `settings` | id, user_id, business_name, address, gstin, phone, email, logo_url |

#### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create user, hash password, return JWT |
| POST | `/api/v1/auth/login` | Validate credentials, return JWT |
| POST | `/api/v1/auth/forgot-password` | Mock reset response |
| GET | `/api/v1/users/me` | Return current user (JWT protected) |

#### All Other Endpoints
Following the existing [API_ENDPOINTS.md](file:///Users/sudhanshukumar/Desktop/goldBridge/API_ENDPOINTS.md) specification exactly.

---

### 3. Frontend — Vite Proxy Configuration

#### [MODIFY] [vite.config.js](file:///Users/sudhanshukumar/Desktop/goldBridge/vite.config.js)
- Add proxy: `/api` → `http://localhost:5000`

---

### 4. Frontend — Auth Context & Protected Routes

#### [NEW] `src/context/AuthContext.jsx`
- React Context providing `user`, `token`, `login()`, `register()`, `logout()`
- Token stored in `localStorage`
- Auto-load user on app init via `/api/v1/users/me`

#### [NEW] `src/components/ProtectedRoute.jsx`
- Wraps dashboard routes, redirects to `/login` if no token

#### [MODIFY] [App.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/App.jsx)
- Wrap with `AuthProvider`
- Add `ProtectedRoute` around dashboard layout
- Add routes for all 9 new dashboard pages

#### [MODIFY] [LoginPage.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/LoginPage.jsx)
- Call `POST /api/v1/auth/login` on submit
- Store JWT, redirect to `/dashboard`

#### [MODIFY] [RegisterPage.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/RegisterPage.jsx)
- Call `POST /api/v1/auth/register` on submit
- Store JWT, redirect to `/dashboard`

#### [MODIFY] [DashboardLayout.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/layouts/DashboardLayout.jsx)
- Display real user name/initials from AuthContext
- Logout button calls `logout()` and redirects to `/login`

#### [MODIFY] [Sidebar.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/components/Sidebar.jsx)
- Logout link calls `logout()` from AuthContext instead of simple Link

---

### 5. Frontend — 9 New Dashboard Pages

All pages follow the same design language as [DashboardHome.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/DashboardHome.jsx): white card containers, navy typography, gold accents, inline styles matching the design system.

#### [NEW] `src/pages/dashboard/InventoryPage.jsx` → `/dashboard/inventory`
- **Header**: Title + "Add Item" button
- **Filters Bar**: Category dropdown, Purity dropdown, Status filter, Search input
- **Data Table**: SKU, Name, Category, Weight (g), Purity, Making Charge, Status, Actions (Edit/Delete)
- **Add/Edit Modal**: Form with fields for all inventory item properties
- Fetches from `GET /api/v1/inventory`, creates via `POST /api/v1/inventory`

#### [NEW] `src/pages/dashboard/SalesPage.jsx` → `/dashboard/sales`
- **Stats Row**: Today's Sales, Pending Orders, Completed Orders, Total Revenue
- **Create Order Form/Modal**: Customer select, Add items, GST toggle, Payment method, Discount
- **Orders Table**: Order ID, Customer, Items count, Total, Status badge, Date, Actions
- Fetches from `GET /api/v1/sales/orders`

#### [NEW] `src/pages/dashboard/PurchasesPage.jsx` → `/dashboard/purchases`
- **Header**: Title + "New Purchase" button
- **Purchase Table**: ID, Supplier, Items, Total Amount, Status, Date, Actions
- **Add Purchase Modal**: Supplier name, Items (weight, purity, cost), Notes
- Fetches from `GET /api/v1/purchases`

#### [NEW] `src/pages/dashboard/CustomersPage.jsx` → `/dashboard/customers`
- **Search Bar** + "Add Customer" button
- **Customer Cards/Table**: Name, Phone, Email, Total Purchases, Loyalty Points, Actions
- **Customer Detail View**: Purchase history, Contact info, PAN
- Fetches from `GET /api/v1/customers`

#### [NEW] `src/pages/dashboard/ManufacturingPage.jsx` → `/dashboard/manufacturing`
- **Kanban-style Stages**: Design → Casting → Polishing → Setting → QC → Complete
- **Job Cards**: Artisan, Item type, Weight, Purity, Due date, Wastage
- **Add Job Modal**: Artisan, Item details, Due date
- Fetches from `GET /api/v1/manufacturing`

#### [NEW] `src/pages/dashboard/DashboardGoldRatesPage.jsx` → `/dashboard/gold-rates`
- **Rate Cards**: 24K, 22K, 18K Gold + Silver with live indicator
- **Historical Chart**: Line chart with 30-day rate trends
- **Rate Calculator**: Input weight + select purity → calculated value
- Fetches from `GET /api/v1/rates/live`, `GET /api/v1/rates/history`

#### [NEW] `src/pages/dashboard/DashboardReportsPage.jsx` → `/dashboard/reports`
- **Report Cards**: Sales Report, Stock Valuation, GST Report, Profit & Loss, Gold Movement
- **Date Range Picker**: Start date, End date, Group by (day/week/month)
- **Generated Report View**: Table with data + summary stats
- Fetches from `GET /api/v1/reports/*`

#### [NEW] `src/pages/dashboard/InvoicesPage.jsx` → `/dashboard/invoices`
- **Invoices Table**: Invoice #, Order ID, Customer, Amount, GST, Template, Date, Actions (View/Download)
- **Template Selector**: Classic, Modern, Minimal, Premium previews
- **Invoice Preview Modal**: Full invoice layout
- Fetches from `GET /api/v1/invoices`

#### [NEW] `src/pages/dashboard/SettingsPage.jsx` → `/dashboard/settings`
- **Tabs**: Business Profile, Account, Preferences
- **Business Profile**: Business name, Address, GSTIN, Phone, Email, Logo upload
- **Account**: Change password, Email preferences
- **Preferences**: Currency, Date format, Invoice template default
- Fetches from `GET /api/v1/settings`, updates via `PUT /api/v1/settings`

---

## Verification Plan

### Automated
```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Start backend
cd server && npm install && npm start

# 3. Start frontend
npm run dev
```

### Manual Verification
1. Register a new user → verify JWT returned and stored
2. Login with the same credentials → verify dashboard loads
3. Navigate all 9 sidebar links → verify each page renders
4. Create inventory item → verify it appears in table
5. Create a sales order → verify order in list
6. Create a customer → verify in customers page
7. Logout → verify redirect to login, dashboard is inaccessible
