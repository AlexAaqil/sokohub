import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import authRoutes from './routes/auth';
import shopRoutes from './routes/shops';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import statsRoutes from './routes/stats';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sokohub API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🏪 Shops: http://localhost:${PORT}/api/shops`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`📋 Orders: http://localhost:${PORT}/api/orders`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
});