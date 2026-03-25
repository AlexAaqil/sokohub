import api from './client';

export interface Product {
  id: number;
  shop_id: number;
  name: string;
  description: string;
  price: number;
  discount_pct: number;
  is_on_offer: boolean;
  stock_qty: number;
  image_url: string | null;
  category: string;
  created_at: string;
}

export interface ProductWithShop extends Product {
  shop_name: string;
  shop_id: number;
}

export const productAPI = {
  // Get all products (public)
  getAll: async (params?: { shop_id?: number; category?: string; on_offer?: boolean; search?: string }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get products by shop
  getByShop: async (shopId: number) => {
    const response = await api.get(`/products/shop/${shopId}`);
    return response.data;
  },

  // Get deals (products on offer filtered by type: 'flash' or 'clearance')
  getDeals: async (params?: { category?: string; type?: 'flash' | 'clearance' }) => {
    const response = await api.get('/products/deals', { params });
    return response.data as ProductWithShop[];
  },

  // Get a single product
  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a product (requires auth, must be shop owner)
  create: async (data: {
    shop_id: number;
    name: string;
    description?: string;
    price: number;
    discount_pct?: number;
    is_on_offer?: boolean;
    stock_qty?: number;
    image_url?: string;
    category?: string;
  }) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update a product (requires auth, must be shop owner)
  update: async (id: number, data: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete a product (requires auth, must be shop owner)
  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};