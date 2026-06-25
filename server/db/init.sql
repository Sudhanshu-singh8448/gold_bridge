-- GoldBridge ERP Database Schema
-- PostgreSQL 16

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'admin',
    business_name VARCHAR(255),
    oauth_provider VARCHAR(20),
    oauth_id VARCHAR(255),
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ========== INVENTORY ==========
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sku VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    weight DECIMAL(10, 3) NOT NULL DEFAULT 0,
    purity INTEGER NOT NULL DEFAULT 22,
    making_charge DECIMAL(10, 2) DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'In Stock',
    barcode VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_user ON inventory(user_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);

-- ========== CUSTOMERS ==========
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    pan_number VARCHAR(20),
    loyalty_points INTEGER DEFAULT 0,
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    last_purchase_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_user ON customers(user_id);
CREATE UNIQUE INDEX idx_customers_user_phone ON customers(user_id, phone) WHERE phone IS NOT NULL;

-- ========== SALES ORDERS ==========
CREATE TABLE IF NOT EXISTS sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    items JSONB NOT NULL DEFAULT '[]',
    is_gst BOOLEAN DEFAULT true,
    cgst_rate DECIMAL(5, 2) DEFAULT 1.5,
    sgst_rate DECIMAL(5, 2) DEFAULT 1.5,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_user ON sales_orders(user_id);
CREATE INDEX idx_sales_status ON sales_orders(status);

-- ========== PURCHASES ==========
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_phone VARCHAR(20),
    items JSONB NOT NULL DEFAULT '[]',
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purchases_user ON purchases(user_id);

-- ========== MANUFACTURING JOBS ==========
CREATE TABLE IF NOT EXISTS manufacturing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artisan_name VARCHAR(255) NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    weight DECIMAL(10, 3) NOT NULL DEFAULT 0,
    purity INTEGER DEFAULT 22,
    stage VARCHAR(50) DEFAULT 'Design',
    wastage DECIMAL(10, 3) DEFAULT 0,
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_manufacturing_user ON manufacturing_jobs(user_id);
CREATE INDEX idx_manufacturing_stage ON manufacturing_jobs(stage);

-- ========== INVOICES ==========
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES sales_orders(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    template VARCHAR(50) DEFAULT 'classic',
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(12, 2) DEFAULT 0,
    gst_amount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoices_user ON invoices(user_id);

-- ========== SETTINGS ==========
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    address TEXT,
    gstin VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    currency VARCHAR(10) DEFAULT 'INR',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    default_template VARCHAR(50) DEFAULT 'classic',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
