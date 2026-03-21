-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SHOPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shops (
  id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(80),
  logo_url TEXT,
  cover_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  discount_pct INT DEFAULT 0,
  is_on_offer BOOLEAN DEFAULT FALSE,
  stock_qty INT DEFAULT 0,
  image_url TEXT,
  category VARCHAR(80),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id),
  total_amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL
);

-- ============================================
-- SOCIAL POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);