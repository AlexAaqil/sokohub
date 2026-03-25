export interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: 'customer' | 'seller' | 'admin';
  avatar_url?: string;
  created_at: Date;
}

export interface Shop {
  id: number;
  owner_id: number;
  name: string;
  description?: string;
  category?: string;
  logo_url?: string;
  cover_url?: string;
  is_active: boolean;
  created_at: Date;
}

export interface Product {
  id: number;
  shop_id: number;
  name: string;
  description?: string;
  price: number;
  discount_pct: number;
  is_on_offer: boolean;
  stock_qty: number;
  image_url?: string;
  category?: string;
  created_at: Date;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'mpesa' | 'card' | null;
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  created_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: Date;
}

export interface CreateOrderInput {
  items: {
    product_id: number;
    quantity: number;
  }[];
  payment_method?: 'mpesa' | 'card';
}