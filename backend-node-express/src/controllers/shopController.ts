import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category, logo_url, cover_url } = req.body;
    const owner_id = req.user?.id;

    const result = await pool.query(
      `INSERT INTO shops (owner_id, name, description, category, logo_url, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [owner_id, name, description, category, logo_url, cover_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyShops = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shops WHERE owner_id = $1 ORDER BY created_at DESC',
      [req.user?.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my shops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM shops WHERE is_active = true';
    const params: any[] = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all shops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT s.*, u.full_name as owner_name, 
              COUNT(p.id) as product_count,
              AVG(r.rating) as avg_rating
       FROM shops s
       LEFT JOIN users u ON s.owner_id = u.id
       LEFT JOIN products p ON s.id = p.shop_id
       LEFT JOIN reviews r ON s.id = r.shop_id
       WHERE s.id = $1
       GROUP BY s.id, u.full_name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get shop by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateShop = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, category, logo_url, cover_url, is_active } = req.body;

    // Verify ownership
    const shopCheck = await pool.query(
      'SELECT owner_id FROM shops WHERE id = $1',
      [id]
    );

    if (shopCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shopCheck.rows[0].owner_id !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized to update this shop' });
    }

    const result = await pool.query(
      `UPDATE shops 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           logo_url = COALESCE($4, logo_url),
           cover_url = COALESCE($5, cover_url),
           is_active = COALESCE($6, is_active)
       WHERE id = $7
       RETURNING *`,
      [name, description, category, logo_url, cover_url, is_active, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteShop = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const shopCheck = await pool.query(
      'SELECT owner_id FROM shops WHERE id = $1',
      [id]
    );

    if (shopCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shopCheck.rows[0].owner_id !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized to delete this shop' });
    }

    await pool.query('DELETE FROM shops WHERE id = $1', [id]);

    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};