import api from './client';

export interface Shop {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  category: string;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
}

export const shopAPI = {
  // Get all shops (public)
  getAll: async (params?: { category?: string; search?: string }) => {
    const response = await api.get('/shops', { params });
    return response.data;
  },

  // Get a single shop by ID
  getById: async (id: number) => {
    const response = await api.get(`/shops/${id}`);
    return response.data;
  },

  // Get current user's shops (requires auth)
  getMyShops: async () => {
    const response = await api.get('/shops/my/shops');
    return response.data;
  },

  // Create a new shop (requires auth)
  create: async (data: {
    name: string;
    description?: string;
    category?: string;
    logo_url?: string;
    cover_url?: string;
  }) => {
    const response = await api.post('/shops', data);
    return response.data;
  },

  // Update a shop (requires auth, must be owner)
  update: async (id: number, data: Partial<Shop>) => {
    const response = await api.put(`/shops/${id}`, data);
    return response.data;
  },

  // Delete a shop (requires auth, must be owner)
  delete: async (id: number) => {
    const response = await api.delete(`/shops/${id}`);
    return response.data;
  },
};