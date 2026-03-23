import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { shop_id, name, description, price, discount_pct, is_on_offer, stock_qty, image_url, category } = req.body;
    const user_id = req.user?.id;

    // Verify user owns the shop
    const shopCheck = await pool.query(
      'SELECT owner_id FROM shops WHERE id = $1',
      [shop_id]
    );

    if (shopCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shopCheck.rows[0].owner_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to add products to this shop' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Valid price is required' });
    }

    const result = await pool.query(
      `INSERT INTO products (shop_id, name, description, price, discount_pct, is_on_offer, stock_qty, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [shop_id, name, description, price, discount_pct || 0, is_on_offer || false, stock_qty || 0, image_url, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { shop_id, category, on_offer, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (shop_id) {
      params.push(shop_id);
      query += ` AND shop_id = $${params.length}`;
    }

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (on_offer === 'true') {
      query += ` AND is_on_offer = true`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductsByShop = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE shop_id = $1 ORDER BY created_at DESC',
      [shopId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get products by shop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, s.name as shop_name, s.owner_id
       FROM products p
       LEFT JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, discount_pct, is_on_offer, stock_qty, image_url, category } = req.body;
    const user_id = req.user?.id;

    // Verify user owns the shop that owns this product
    const productCheck = await pool.query(
      `SELECT p.*, s.owner_id 
       FROM products p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (productCheck.rows[0].owner_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           discount_pct = COALESCE($4, discount_pct),
           is_on_offer = COALESCE($5, is_on_offer),
           stock_qty = COALESCE($6, stock_qty),
           image_url = COALESCE($7, image_url),
           category = COALESCE($8, category)
       WHERE id = $9
       RETURNING *`,
      [name, description, price, discount_pct, is_on_offer, stock_qty, image_url, category, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    // Verify user owns the shop that owns this product
    const productCheck = await pool.query(
      `SELECT p.*, s.owner_id 
       FROM products p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (productCheck.rows[0].owner_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
