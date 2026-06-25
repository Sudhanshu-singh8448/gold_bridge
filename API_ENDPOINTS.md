# GoldBridge API Endpoints

This document specifies the backend API endpoints required for the GoldBridge ERP application. All requests and responses should use `application/json` unless otherwise specified.

## 1. Authentication & Users

### POST `/api/v1/auth/register`
- **Description:** Register a new user/business account.
- **Request:** `{ "name": "...", "phone": "...", "email": "...", "password": "..." }`
- **Response:** `{ "token": "jwt_token", "user": { "id": "...", "name": "...", "email": "..." } }`

### POST `/api/v1/auth/login`
- **Description:** Authenticate existing user.
- **Request:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "token": "jwt_token", "user": { ... } }`

### POST `/api/v1/auth/forgot-password`
- **Description:** Send password reset link to email.
- **Request:** `{ "email": "..." }`
- **Response:** `{ "message": "Reset link sent" }`

### GET `/api/v1/users/me`
- **Description:** Get current authenticated user profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "id": "...", "name": "...", "email": "...", "role": "admin", "businessName": "..." }`

---

## 2. Dashboard Analytics

### GET `/api/v1/dashboard/summary`
- **Description:** Get key metrics for dashboard.
- **Query Params:** `period=today|week|month|year`
- **Response:** 
  ```json
  {
    "totalRevenue": { "value": 1450000, "trend": 12.5 },
    "totalOrders": { "value": 142, "trend": 5.2 },
    "newCustomers": { "value": 28, "trend": -2.1 },
    "goldStock": { "value": 4200, "unit": "g", "trend": 1.5 }
  }
  ```

### GET `/api/v1/dashboard/charts`
- **Description:** Get data for dashboard charts (revenue trend, category sales, stock valuation).
- **Query Params:** `period=week|month|year`

---

## 3. Inventory Management

### GET `/api/v1/inventory`
- **Description:** List all inventory items.
- **Query Params:** `category`, `purity`, `status`, `search`
- **Response:** `[ { "id": "...", "sku": "...", "name": "Ring", "category": "Rings", "weight": 12.5, "purity": 22, "status": "In Stock" } ]`

### POST `/api/v1/inventory`
- **Description:** Add a new item to inventory.
- **Request:** `{ "sku": "...", "name": "...", "category": "...", "weight": 12.5, "purity": 22, "barcode": "..." }`

### GET `/api/v1/inventory/:id`
- **Description:** Get details of a specific item.

### PUT `/api/v1/inventory/:id`
- **Description:** Update an existing inventory item.

### DELETE `/api/v1/inventory/:id`
- **Description:** Mark item as removed/deleted.

---

## 4. Sales & Billing

### GET `/api/v1/sales/orders`
- **Description:** List all sales orders.
- **Query Params:** `status`, `dateRange`, `customerId`

### POST `/api/v1/sales/orders`
- **Description:** Create a new sales order/invoice.
- **Request:** 
  ```json
  {
    "customerId": "...",
    "items": [ { "inventoryId": "...", "price": 45000 } ],
    "isGst": true,
    "cgstRate": 1.5,
    "sgstRate": 1.5,
    "discount": 0,
    "totalAmount": 46350,
    "paymentMethod": "UPI"
  }
  ```

### GET `/api/v1/sales/orders/:id/invoice`
- **Description:** Get invoice details or download PDF.
- **Query Params:** `format=pdf|json`, `template=classic|modern|minimal|premium`

---

## 5. Live Gold Rates

### GET `/api/v1/rates/live`
- **Description:** Fetch real-time gold and silver rates.
- **Response:** 
  ```json
  {
    "timestamp": "2023-10-27T10:15:00Z",
    "rates": [
      { "purity": 24, "metal": "Gold", "rate": 7250, "change": 0.5 },
      { "purity": 22, "metal": "Gold", "rate": 6645, "change": 0.8 },
      { "purity": 18, "metal": "Gold", "rate": 5438, "change": 0.3 },
      { "purity": 999, "metal": "Silver", "rate": 92, "change": -0.2 }
    ]
  }
  ```

### GET `/api/v1/rates/history`
- **Description:** Fetch historical rate data for charts.
- **Query Params:** `metal=gold|silver`, `purity=24|22|18`, `days=30`

---

## 6. Customers (CRM)

### GET `/api/v1/customers`
- **Description:** List all customers.
- **Query Params:** `search`, `sortBy`

### POST `/api/v1/customers`
- **Description:** Create a new customer profile.
- **Request:** `{ "name": "...", "phone": "...", "email": "...", "address": "...", "panNumber": "..." }`

### GET `/api/v1/customers/:id`
- **Description:** Get customer details, including purchase history and loyalty points.

---

## 7. Reports & Analytics

### GET `/api/v1/reports/sales`
- **Description:** Generate sales report.
- **Query Params:** `startDate`, `endDate`, `groupBy=day|week|month`

### GET `/api/v1/reports/stock-valuation`
- **Description:** Generate current stock valuation report based on live rates.

### GET `/api/v1/reports/gst`
- **Description:** Generate GST summary report (GSTR-1, GSTR-3B format).
- **Query Params:** `month`, `year`
