# GoldBridge ERP — Customer, Order, and Inventory Architecture

This document describes the flow and architecture for how Sales, Purchases, Inventory, and Customers are linked together in the GoldBridge ERP system.

## 1. Database Schema Additions

To support this architecture, the following columns were added:

**`inventory` table:**
- `quantity` (INTEGER DEFAULT 1): To allow multiple identical items to be tracked as a single inventory line item.
- `purchase_price` (DECIMAL): To track the cost basis of the item for profitability calculations.

**`customers` table:**
- `total_orders` (INTEGER DEFAULT 0): The count of completed orders for this customer.
- `last_purchase_date` (TIMESTAMP): The timestamp of their most recent completed order.
- Unique Index on `(user_id, phone)`: To ensure we can uniquely link orders to a customer by their phone number.

**`sales_orders` table:**
- `customer_phone` (VARCHAR): Stored redundantly on the order for quick reference without needing a JOIN.

## 2. API Endpoints

### Customers
- `GET /api/v1/customers`: List all customers.
- `POST /api/v1/customers`: Create a new customer manually.
- `GET /api/v1/customers/:id`: Get a customer's profile, including their `purchaseHistory` and detailed `statistics`.

### Inventory
- `GET /api/v1/inventory`: Fetch inventory items (can filter by `status=In Stock`).

### Sales Orders
- `GET /api/v1/sales/orders`: List all sales orders.
- `POST /api/v1/sales/orders`: Create a new sales order.
- `PUT /api/v1/sales/orders/:id`: Update order status (triggers inventory deduction and customer stat updates when set to `Completed`).
- `POST /api/v1/sales/orders/:id/send-email`: Email the invoice to the customer.
- `POST /api/v1/sales/orders/:id/send-whatsapp`: WhatsApp the invoice to the customer.

### Purchases
- `PUT /api/v1/purchases/:id`: Update purchase status (triggers inventory sync when set to `Received`).

## 3. Data Flows

### A. Purchase → Inventory Sync Flow
1. A user creates a raw material purchase via **PurchasesPage**.
2. When the physical items arrive, the user changes the status to **"Received"**.
3. The backend `PUT /api/v1/purchases/:id` route kicks in.
4. For each item in the purchase, the system checks if a matching inventory item already exists (same `name` and `category`).
5. If it exists, it increments the `quantity` of the existing inventory item.
6. If it does not exist, it inserts a new row into the `inventory` table.

### B. Sales Order Creation & Stock Validation Flow
1. A user creates a sales order via **SalesPage**.
2. Instead of typing item names manually, the user selects from a dropdown populated by `GET /api/v1/inventory?status=In Stock`.
3. Selecting an item auto-fills the weight, category, and price.
4. The frontend verifies that the requested `qty` is less than or equal to the available `quantity` in stock.
5. On submit, `POST /api/v1/sales/orders` validates the stock again on the server side.

### C. Customer Auto-Creation Flow
1. During sales order creation, the user enters a `customerName` and `customerPhone`.
2. The `POST /api/v1/sales/orders` endpoint checks if a customer with that phone number exists for this user.
3. If they exist, the order is linked to that `customer_id`.
4. If they do not exist, a new customer is inserted into the `customers` table automatically, and the order is linked to the new `customer_id`.

### D. Order Completion (Inventory Deduction & Customer Stats) Flow
1. When a sales order status is changed to **"Completed"**, the `PUT /api/v1/sales/orders/:id` endpoint uses a SQL Transaction.
2. **Inventory Deduction**: For each item in the order, it subtracts the purchased `qty` from the inventory's `quantity`. If `quantity` hits 0, the inventory item's `status` is set to `"Sold"`.
3. **Customer Stats**: It updates the linked customer:
   - `total_purchases += order_total`
   - `total_orders += 1`
   - `loyalty_points += floor(order_total / 100)`
   - `last_purchase_date = NOW()`

## 4. Invoice Communication (Email/WhatsApp)

The `InvoiceModal` provides buttons to send the invoice via Email or WhatsApp.

**Email Setup (Nodemailer)**
Requires the following environment variables in your `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**WhatsApp Setup (Meta Cloud API)**
Requires a Meta Developer account and the following environment variables:
```env
WHATSAPP_TOKEN=EAAVesveZBN0cBR0r4S4Pq4rWk29GXl6hA72JvxZCpawMrspZANfdaZA9WLMIyNlwoyVOZBcLOrrfI6af4he91o7bcmWlZBnafQGrvtah067Jzcvvvt8wFGUHGp0ZBLsmn2L2gzPBLBFgZBZBndFxynQMUZCMSM8YMIPaFgq2m2stTOjpMEBnfBCLLd8kjdmw3pEqzW734PBnV6JtpWpOoedLkjYvHjcJwu5vVPMQWISQewBSJLOf9RpdoiJq1ZBWE9m8kAWbRZBiIbzbu82q9L0ucbaJBgG2
WHATSAPP_PHONE_ID=1165052340030212
```

If these are not configured, the backend services will gracefully skip sending and return an appropriate message to the frontend without crashing.
