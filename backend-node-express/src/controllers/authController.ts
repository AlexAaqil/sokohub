import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

export const register = async (req: Request, res: Response) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Make sure password exists
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, full_name, email, role, created_at`,
      [full_name, email, hashedPassword, role || 'customer']
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, full_name, email, password, role FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const result = await pool.query(
      'SELECT id, full_name, email, role, avatar_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};