import api from './client';

export interface Stats {
  active_shops: number;
  total_products: number;
  daily_shoppers: number;
}

export const statsAPI = {
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/stats');
    return response.data;
  },
};