import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

// Create a new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  const client = await pool.connect();
  
  try {
    const { items, payment_method } = req.body;
    const customer_id = req.user?.id;

    if (!customer_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Start transaction
    await client.query('BEGIN');

    // Calculate total amount and verify products exist & have stock
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, price, stock_qty, name FROM products WHERE id = $1',
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }

      const product = productResult.rows[0];

      if (product.stock_qty < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Insufficient stock for product: ${product.name}. Available: ${product.stock_qty}` 
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      total_amount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        name: product.name
      });
    }

    // Create the order
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total_amount, payment_method, status, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_id, total_amount, payment_method || null, 'pending', 'unpaid']
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.unit_price]
      );

      // Update stock
      await client.query(
        'UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');

    // Fetch complete order with items
    const completeOrder = await getOrderWithItems(order.id, customer_id);

    res.status(201).json(completeOrder);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

// Helper function to get order with items
const getOrderWithItems = async (orderId: number, userId: number) => {
  const orderResult = await pool.query(
    `SELECT o.*, u.full_name as customer_name
     FROM orders o
     JOIN users u ON o.customer_id = u.id
     WHERE o.id = $1 AND o.customer_id = $2`,
    [orderId, userId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const itemsResult = await pool.query(
    `SELECT oi.*, p.name as product_name, p.image_url
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows
  };
};

// Get current user's orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const customer_id = req.user?.id;

    const ordersResult = await pool.query(
      `SELECT o.*, 
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC`,
      [customer_id]
    );

    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT oi.*, p.name as product_name, p.image_url, s.name as shop_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN shops s ON p.shop_id = s.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      orders.push({ ...order, items: itemsResult.rows });
    }

    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get orders for shops owned by the current user (seller view)
export const getShopOrders = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user?.id;

    const ordersResult = await pool.query(
      `SELECT DISTINCT o.id, o.customer_id, o.total_amount, o.status, o.payment_method, o.payment_status, o.created_at, u.full_name as customer_name
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN shops s ON p.shop_id = s.id
       JOIN users u ON o.customer_id = u.id
       WHERE s.owner_id = $1
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT oi.*, p.name as product_name, p.image_url, s.name as shop_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN shops s ON p.shop_id = s.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      orders.push({ ...order, items: itemsResult.rows });
    }

    res.json(orders);
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    const user_role = req.user?.role;

    // Get order
    const orderResult = await pool.query(
      `SELECT o.*, u.full_name as customer_name, u.email as customer_email
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Check authorization: customer or shop owner can view
    if (user_role !== 'admin' && order.customer_id !== user_id) {
      // Check if user owns any shop that sold items in this order
      const shopCheck = await pool.query(
        `SELECT s.id FROM shops s
         JOIN products p ON s.id = p.shop_id
         JOIN order_items oi ON p.id = oi.product_id
         WHERE oi.order_id = $1 AND s.owner_id = $2
         LIMIT 1`,
        [id, user_id]
      );

      if (shopCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Not authorized to view this order' });
      }
    }

    // Get order items with product and shop info
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image_url, 
              s.id as shop_id, s.name as shop_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN shops s ON p.shop_id = s.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      ...order,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update order status (for shop owners)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user?.id;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify user owns a shop that sells products in this order
    const authCheck = await pool.query(
      `SELECT o.id FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN shops s ON p.shop_id = s.id
       WHERE o.id = $1 AND s.owner_id = $2
       LIMIT 1`,
      [id, user_id]
    );

    if (authCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this order' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({
      message: 'Order status updated',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add this function to your controller - this will be the route handler
export const updatePaymentStatusHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;
    const user_id = req.user?.id;

    const validPaymentStatuses = ['unpaid', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(payment_status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    // Verify user owns this order
    const orderCheck = await pool.query(
      'SELECT customer_id FROM orders WHERE id = $1',
      [id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (orderCheck.rows[0].customer_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to update payment for this order' });
    }

    // Update payment status
    const result = await pool.query(
      `UPDATE orders 
       SET payment_status = $1, 
           payment_method = COALESCE($2, payment_method)
       WHERE id = $3 
       RETURNING *`,
      [payment_status, payment_method, id]
    );

    // If payment is successful, also update order status to paid
    if (payment_status === 'paid') {
      await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['paid', id]
      );
    }

    res.json({
      message: 'Payment status updated',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Keep the existing helper function for internal use (called by payment webhooks)
export const updatePaymentStatusInternal = async (orderId: number, paymentStatus: string, paymentMethod: string) => {
  try {
    const result = await pool.query(
      `UPDATE orders 
       SET payment_status = $1, payment_method = $2, status = 'paid'
       WHERE id = $3
       RETURNING *`,
      [paymentStatus, paymentMethod, orderId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Update payment status error:', error);
    throw error;
  }
};