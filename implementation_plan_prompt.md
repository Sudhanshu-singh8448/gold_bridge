# GoldBridge ERP — Sales, Customers, Inventory & Billing Enhancement

Comprehensive upgrade to connect Sales, Customers, Inventory and Purchases into a fully synchronized system with auto-calculations, printable invoices, and customer history.

## User Review Required

> [!IMPORTANT]
> **Inventory table has no `quantity` column.** Currently, each inventory row represents one unique item (e.g. one ring). The `status` column (`In Stock` / `Sold`) tracks availability. I will add a `quantity INTEGER DEFAULT 1` and `purchase_price DECIMAL` column so we can track quantities properly for the purchase→inventory sync and inventory-controlled sales features.

> [!IMPORTANT]
> **Customers table needs `total_orders` and `last_purchase_date` columns.** I'll add these via SQL migration. `total_purchases` and `loyalty_points` already exist.

> [!WARNING]
> **Email & WhatsApp invoice sending** require external service credentials (SMTP for email, Meta Cloud API for WhatsApp). I will create the backend services and frontend buttons, but they will show a "Not configured" state until you add the credentials to `.env`. The documentation file will explain exactly how to set them up.

## Open Questions

1. **Invoice PDF library**: I'll use browser's native `window.print()` for printing and a pure-HTML-to-canvas approach for PDF download (no heavy dependencies). Is that acceptable, or do you want a server-side PDF library like `puppeteer` or `pdfkit`?

## Proposed Changes

### Phase 1: Database Migrations

#### [MODIFY] [init.sql](file:///Users/sudhanshukumar/Desktop/goldBridge/server/db/init.sql)
- Add `quantity INTEGER DEFAULT 1` and `purchase_price DECIMAL(12,2) DEFAULT 0` to `inventory` table
- Add `total_orders INTEGER DEFAULT 0` and `last_purchase_date TIMESTAMP` to `customers` table
- Add unique index `UNIQUE(user_id, phone)` on `customers`
- Add `customer_phone VARCHAR(20)` to `sales_orders` table

Run migration SQL on live database via `docker exec`.

---

### Phase 2: Backend — Sales Route Overhaul

#### [MODIFY] [sales.js](file:///Users/sudhanshukumar/Desktop/goldBridge/server/routes/sales.js)

**POST /orders** — On new order creation:
1. Accept `customerPhone` in addition to `customerName`
2. If phone is provided, check `SELECT FROM customers WHERE phone = $1 AND user_id = $2`
3. If customer exists → use that `customer_id`
4. If customer doesn't exist → `INSERT INTO customers` with name+phone → get `customer_id`
5. Store `customer_id` and `customer_phone` on the order
6. Each item in the order must reference an `inventory_id` so we can validate stock

**PUT /orders/:id** — On status change to `Completed`:
1. Use a DB transaction (`BEGIN ... COMMIT`)
2. Deduct inventory quantities for each item (set `status = 'Sold'` if qty reaches 0)
3. Update customer: `total_purchases += order_total`, `total_orders += 1`, `loyalty_points += floor(total/100)`, `last_purchase_date = NOW()`
4. Prevent negative stock with validation

**New: POST /orders/:id/send-email** — Generate invoice HTML, send via Nodemailer
**New: POST /orders/:id/send-whatsapp** — Send invoice via WhatsApp Cloud API

---

### Phase 3: Backend — Purchases Route Overhaul

#### [MODIFY] [purchases.js](file:///Users/sudhanshukumar/Desktop/goldBridge/server/routes/purchases.js)

**PUT /:id** — On status change to `Received`:
1. Use a DB transaction
2. For each item in the purchase: check if inventory item with same name+category exists for this user
   - If exists → increment `quantity`
   - If not → `INSERT INTO inventory` with the item details
3. Set purchase `status = 'Received'`

---

### Phase 4: Backend — Customer History API

#### [MODIFY] [customers.js](file:///Users/sudhanshukumar/Desktop/goldBridge/server/routes/customers.js)

**GET /:id** — Enhance to return full customer profile:
- Customer info + statistics
- All sales orders (with items JSONB expanded)
- Timeline of activity

**GET /:id/history** — Dedicated history endpoint returning:
```json
{ "customer": {...}, "statistics": {...}, "orders": [...] }
```

---

### Phase 5: Backend — Email & WhatsApp Services

#### [NEW] [emailService.js](file:///Users/sudhanshukumar/Desktop/goldBridge/server/services/emailService.js)
- Uses Nodemailer with SMTP config from env
- `sendInvoiceEmail(orderData, customerEmail, businessSettings)` function
- Returns success/failure, graceful handling if not configured

#### [NEW] [whatsappService.js](file:///Users/sudhanshukumar/Desktop/goldBridge/server/services/whatsappService.js)
- Uses WhatsApp Cloud API (Meta Business)
- `sendInvoiceWhatsApp(orderData, customerPhone, businessSettings)` function
- Returns success/failure, graceful handling if not configured

---

### Phase 6: Frontend — PurchasesPage Auto-Calculate

#### [MODIFY] [PurchasesPage.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/dashboard/PurchasesPage.jsx)
- Add `useEffect` that auto-sums `item.cost` across all items whenever items change
- Update `totalAmount` in form state automatically
- Make the total amount field read-only (computed)
- Show per-item line totals

---

### Phase 7: Frontend — SalesPage Inventory Integration

#### [MODIFY] [SalesPage.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/dashboard/SalesPage.jsx)
- On modal open, fetch inventory items (`status = 'In Stock'`, `quantity > 0`)
- Replace manual item name input with a **dropdown of available inventory items**
- On selecting an item → auto-fill name, weight, category, price
- Add `customerPhone` field alongside `customerName`
- Validate stock before submission (qty requested ≤ qty available)
- Show "Insufficient stock" error inline
- Add Print/Download/Email/WhatsApp buttons on each completed order row

---

### Phase 8: Frontend — CustomerDetailsPage (New)

#### [NEW] [CustomerDetailsPage.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/dashboard/CustomerDetailsPage.jsx)
- Fetches customer data + order history from `GET /customers/:id`
- Shows: Name, Phone, Email, Created Date
- Statistics cards: Total Purchases, Total Orders, Loyalty Points, Last Purchase Date
- Purchase history table with expandable rows showing individual items
- Activity timeline

#### [MODIFY] [CustomersPage.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/pages/dashboard/CustomersPage.jsx)
- Make customer cards clickable → `navigate(/dashboard/customers/${c.id})`

#### [MODIFY] [App.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/App.jsx)
- Add route: `/dashboard/customers/:id` → `CustomerDetailsPage`

---

### Phase 9: Frontend — Invoice Modal

#### [NEW] [InvoiceModal.jsx](file:///Users/sudhanshukumar/Desktop/goldBridge/src/components/InvoiceModal.jsx)
- Professional invoice layout with:
  - Shop name, GST, address (from settings)
  - Customer name, phone
  - Items table (name, weight, qty, price)
  - Subtotal, GST, Discount, Grand Total
  - Loyalty points earned
- **Print** button → `window.print()` with print-specific CSS
- **Download PDF** button → html2canvas + jsPDF (or just print-to-PDF prompt)
- **Send Email** button → calls `POST /sales/:id/send-email`
- **Send WhatsApp** button → calls `POST /sales/:id/send-whatsapp`

---

### Phase 10: Documentation

#### [NEW] [CUSTOMER_ORDER_INVENTORY_FLOW.md](file:///Users/sudhanshukumar/Desktop/goldBridge/CUSTOMER_ORDER_INVENTORY_FLOW.md)
- Architecture overview
- Database schema changes
- API endpoints list
- Inventory ↔ Sales flow
- Purchase → Inventory flow
- Customer auto-creation flow
- Loyalty point calculation
- Invoice print/PDF/email/WhatsApp setup
- Required environment variables
- Testing checklist

---

## Verification Plan

### Automated Tests
- `npm run build` — frontend compiles without errors
- `curl /api/v1/sales/orders` — sales endpoint works
- `curl /api/v1/customers/:id` — customer detail returns history
- `curl /api/v1/inventory?status=In+Stock` — inventory filters work

### Manual Verification
1. Create a purchase → set status to "Received" → verify inventory updated
2. Create a new sales order → select inventory item from dropdown → verify stock validation
3. Complete a sales order → verify inventory qty decremented, customer stats updated, loyalty points added
4. Click a customer card → verify detail page shows all orders
5. Print invoice → verify print layout
6. Download PDF → verify file downloads
