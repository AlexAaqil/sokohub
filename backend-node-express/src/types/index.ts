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