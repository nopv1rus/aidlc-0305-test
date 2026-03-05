-- 테이블오더 서비스 DB 초기화 스크립트
-- Database: table_order

-- 1. 매장 (stores)
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "storeCode" VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 2. 관리자 (admins)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    "loginAttempts" INTEGER DEFAULT 0,
    "lockedUntil" TIMESTAMP,
    "storeId" UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 3. 테이블 (store_tables)
CREATE TABLE IF NOT EXISTS store_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "tableNumber" INTEGER NOT NULL,
    password VARCHAR(255) NOT NULL,
    "sessionId" VARCHAR(255),
    "sessionStartedAt" TIMESTAMP,
    "storeId" UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE("tableNumber", "storeId")
);

-- 4. 메뉴 (menus)
CREATE TABLE IF NOT EXISTS menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 0) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    "imageUrl" VARCHAR(500),
    "sortOrder" INTEGER DEFAULT 0,
    "isAvailable" BOOLEAN DEFAULT TRUE,
    "storeId" UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 5. 주문 (orders)
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'completed');

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" INTEGER NOT NULL,
    status order_status DEFAULT 'pending',
    "totalAmount" DECIMAL(10, 0) NOT NULL,
    "sessionId" VARCHAR(255) NOT NULL,
    "tableId" UUID NOT NULL REFERENCES store_tables(id) ON DELETE CASCADE,
    "storeId" UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    "orderedAt" TIMESTAMP DEFAULT NOW()
);

-- 6. 주문 항목 (order_items)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "menuName" VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    "unitPrice" DECIMAL(10, 0) NOT NULL,
    subtotal DECIMAL(10, 0) NOT NULL,
    "orderId" UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE
);

-- 7. 주문 이력 (order_history) - 세션 종료 시 이동
CREATE TABLE IF NOT EXISTS order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" INTEGER NOT NULL,
    "sessionId" VARCHAR(255) NOT NULL,
    "storeId" UUID NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "totalAmount" DECIMAL(10, 0) NOT NULL,
    items JSONB NOT NULL,
    status VARCHAR(20) NOT NULL,
    "orderedAt" TIMESTAMP NOT NULL,
    "completedAt" TIMESTAMP NOT NULL
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_admins_store ON admins("storeId");
CREATE INDEX IF NOT EXISTS idx_tables_store ON store_tables("storeId");
CREATE INDEX IF NOT EXISTS idx_menus_store ON menus("storeId");
CREATE INDEX IF NOT EXISTS idx_menus_category ON menus("storeId", category);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders("sessionId");
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders("storeId");
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items("orderId");
CREATE INDEX IF NOT EXISTS idx_history_store ON order_history("storeId");
CREATE INDEX IF NOT EXISTS idx_history_completed ON order_history("completedAt");
