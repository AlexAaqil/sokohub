import { Request, Response } from 'express';
import pool from '../db';

export const getStats = async (req: Request, res: Response) => {
  try {
    // Get active shops count
    const shopsResult = await pool.query(
      'SELECT COUNT(*) as count FROM shops WHERE is_active = true'
    );
    
    // Get total products count
    const productsResult = await pool.query(
      'SELECT COUNT(*) as count FROM products'
    );
    
    // Get daily shoppers (orders from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const shoppersResult = await pool.query(
      'SELECT COUNT(DISTINCT customer_id) as count FROM orders WHERE created_at >= $1',
      [today]
    );
    
    res.json({
      active_shops: parseInt(shopsResult.rows[0].count),
      total_products: parseInt(productsResult.rows[0].count),
      daily_shoppers: parseInt(shoppersResult.rows[0].count)
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};