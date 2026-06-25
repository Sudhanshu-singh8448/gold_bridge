-- GoldBridge ERP Migration: Sales-Inventory-Customer Sync
-- Run this on an existing database to add new columns
-- Safe to run multiple times (IF NOT EXISTS)

-- ========== INVENTORY: Add quantity and purchase_price ==========
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(12, 2) DEFAULT 0;

-- ========== CUSTOMERS: Add total_orders and last_purchase_date ==========
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_purchase_date TIMESTAMP;

-- ========== SALES ORDERS: Add customer_phone ==========
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);

-- ========== CUSTOMERS: Unique index on (user_id, phone) ==========
-- Prevents duplicate customers with the same phone per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_user_phone ON customers(user_id, phone) WHERE phone IS NOT NULL;

-- ========== Update existing inventory rows to have quantity = 1 ==========
UPDATE inventory SET quantity = 1 WHERE quantity IS NULL;
