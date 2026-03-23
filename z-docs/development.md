# Phase 1: Environment Setup
## 1.1 Install node.js and npm
Node.js run JS on your server (backend).

npm is like an app sotre for JS packages.

Run these command to ensure successful isntallation.
```bash
node --version
npm --version
```

## 1.2 Install PostgreSQL
Go to https://www.postgresql.org/download/linux/ubuntu/

Follow Ubuntu instructions
```bash
# Create the file repository configuration
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update package list
sudo apt update

# Install PostgreSQL (version 16 is current)
sudo apt install postgresql-16
```

Set a password for Postgres user:
```bash
# Switch to the postgres system user
sudo -u postgres psql

# Set a password (you'll be prompted)
\password postgres
# Enter a password you'll remember - let's use "sokohub123" for now
# (you can change it later)

# Exit PostgreSQL
\q
```

Create your project database:
```bash
# Still as postgres user, create the database
sudo -u postgres createdb sokohub_db

# Or
sudo -u postgres psql -c "CREATE DATABASE sokohub_db;"
```

Verify it worked:
```bash
# Connect to the database
sudo -u postgres psql -d sokohub_db

# You should see: sokohub_db=#

# Exit with: \q
```

Start PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 1.3 Install VS Code extensions
- Thunder Client (By Ranga Vadhineni) : lets you test APIs without leaving VS Code
- PostgreSQL (by Chris Kolkman) : lets you run database queries directly


# PHASE 2: Project Structure and Tooling
## 2.1 Create the project folders
Create the monorepo folder then the frontend and backend folders.
```bash
mkdir sokohub
mkdir sokohub/client
mkdir sokohub/server
```

## 2.2 Scafold the React frontend with vite
Create a fresh React app using Vite (faster and more modern than create React App)
```bash
cd client
npm create vite@latest . --template react
```

Install initial dependencies
```bash
npm install
```

Install additional packages you'll need
```bash
npm install react-route-dom axios @heroicons/react
```

Install Tailwind for styling
```bash
npm install -D tailwindcss @tailwindcss/vite
```

configure tailwind (client/vite.config.ts) by adding everything with:
```js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig ({
    plugins: [
        tailwindcss(),
    ],
})
```

Add tailwind to you css (client/src/index.css)
```css
@import "tailwindcss";
```

Test that it all works.
```bash
npm run dev
```

It should run when you go to: http//localhost:5173

## 2.3 Scafold the Express Backend with TypeScript
Go to the server folder and initialize a new Node.js project:
```bash
cd ../server
npm init -y
```

This creates package.json file with default values.

Install production dependencies (packages your app needs to run):
```bash
npm install express pg cors dotenv bcryptjs jsonwebtoken express-validator multer
```

Install TypeScript and development dependencies:
```bash
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken ts-node nodemon @types/pg @types/express-validator @types/multer
```

- express - the web framework
- pg - PostgreSQL driver
- cors - allows your React app to talk to this API
- dotenv - loads environment variables from .env file
- bcryptjs - hashes passwords securely
- jsonwebtoken - creates login tokens (JWT)
- express-validator - validates user input
- multer - handles file uploads (for product images)
- nodemon - automatically restarts the server when you make changes.

Create the TypeScript configuration
```bash
npx tsc --init
```

This create tsconfig.json which we then replace the contents with:
```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2022",
    "lib": ["ES2022"],
    
    /* Modules */
    "module": "commonjs",
    "rootDir": "./src",
    "moduleResolution": "node",
    
    /* Emit */
    "outDir": "./dist",
    "removeComments": true,
    
    /* Interop Constraints */
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    
    /* Type Checking */
    "strict": true,
    "skipLibCheck": true,
    
    /* Other */
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Update package.json scripts (server/package.json):

Replace the scripts sections with:
```js
"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "clean": "rm -rf dist"
}
```

At the top of the package.json file add shema to avoid any warnings from vscode:
```json
{
  "$schema": "https://json.schemastore.org/package.json",
  "name": "backend-node-express",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "express-validator": "^7.3.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.1.1",
    "pg": "^8.20.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/express-validator": "^2.20.33",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.1.0",
    "@types/node": "^25.5.0",
    "@types/pg": "^8.20.0",
    "nodemon": "^3.1.14",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}
```

Create the folder structure
```bash
mkdir -p src/{routes,middleware,controllers,db,utils,types}
```

This creates:
- src/routes/ - API endpoints (auth, shops, products)
- src/middleware/ - reusable functions (like auth checking)
- src/controllers/ - business logic

Create the main entry point - src/index.ts

Add the initial code as:
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sokohub API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
});
```

Create the db connection - src/db/index.ts:
```ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

export default pool;
```

create the types - src/types/index.ts

Add initial types as:
```ts
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
```

## 2.4 Create the full folder structure
Create all folder needed for both backend and frontend.
```bash
# Frontend additional folders  
cd client/src
mkdir -p api components pages context hooks utils
cd ../..
```

Complete folder structure should now look like:
```
sokohub/
├── client/                      # React frontend
│   ├── node_modules/            # (already there)
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── api/                 # Axios API calls
│       ├── components/          # Reusable UI pieces
│       ├── pages/               # Full page components
│       ├── context/             # Global state (auth)
│       ├── hooks/               # Custom React hooks
│       ├── utils/               # Helper functions
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── server/
    ├── node_modules/
    ├── dist/               (created after build)
    ├── src/
    │   ├── db/
    │   │   └── index.ts    # Database connection
    │   ├── middleware/     # Auth, validation (empty for now)
    │   ├── routes/         # API endpoints (empty for now)
    │   ├── controllers/    # Business logic (empty for now)
    │   ├── types/
    │   │   └── index.ts    # TypeScript interfaces
    │   ├── utils/          # Helper functions (empty for now)
    │   └── index.ts        # Entry point
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── package-lock.json
```

## 2.5 Create the .env file (Backend)
```bash
touch .env
```

Add this content:
```
# Server configuration
PORT=5000

# Database connection
# Replace 'sokohub123' with the password you set for postgres
DATABASE_URL=postgresql://postgres:sokohub123@localhost:5432/sokohub_db

# JWT secret (generate a random string - you can use this for now)
JWT_SECRET=sokohub_super_secret_key_change_this_in_production_123456

# Stripe (placeholder for now)
STRIPE_SECRET_KEY=sk_test_placeholder

# M-Pesa (placeholder for now)
MPESA_CONSUMER_KEY=placeholder
MPESA_CONSUMER_SECRET=placeholder
MPESA_SHORTCODE=174379
MPESA_PASSKEY=placeholder
MPESA_CALLBACK_URL=http://localhost:5000/api/payments/mpesa/callback
```

Create a .gitignore file to protect secrets:
```bash
touch .gitignore
```

Add these lines:
```
# Environment variables
.env

# Dependencies
node_modules/

# Build Output
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db
```

## 2.6 Test the setup:
```bash
npm run dev
```

Test the health endpoint:

Open another terminal and run:
```bash
curl http://localhost:5000/api/health
```

You should see: {"status":"OK","message":"Sokohub API is running"}

## 2.6 Initialize the git repository
In the project root folder:
```bash
git init
```

Create a .gitignore for the root
```
# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

Add everything to git
```bash
git add .
```

Make the first commit
```bash
git commit -m "Initial commit: Sokohub project setup with React + Express"
```

# PHASE 3: Create Database Tables
```sql
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SHOPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shops (
  id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(80),
  logo_url TEXT,
  cover_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL,
  discount_pct INT DEFAULT 0,
  is_on_offer BOOLEAN DEFAULT FALSE,
  stock_qty INT DEFAULT 0,
  image_url TEXT,
  category VARCHAR(80),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id),
  total_amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  payment_method VARCHAR(20),
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL
);

-- ============================================
-- SOCIAL POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Connect to your db and run the SQL
```bash
sudo -u postgres psql -d sokohub_db -f server/src/db/init.sql
```

Or manually connect and paste the SQL commands
```bash
sudo -u postgres psql -d sokohub_db
```

# PHASE 4: User Authentication API
This allows users to register and login, receiving JWT tokens to access protected routes.

## 4.1 Create the Auth Middleware
Create the middleware that protects routes by verifying JWT tokens.

Create server/src/middleware/auth.ts:
```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

## 4.2 Create the Auth Controller
Create server/src/controllers/authController.ts:
```ts
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
```

## 4.3 Create the Auth Routes
Create server/src/routes/auth.ts:
```ts
import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'seller', 'admin']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
```

## 4.4 Update the Main Index File
Update server/src/index.ts to include the auth routes:
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db'; // This runs the database connection test
import authRoutes from './routes/auth';

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sokohub API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
});
```

## 4.5 Test the Authentication API
Test 1: Register a new user

POST http://localhost:5000/api/auth/register

Test 2: Login with the user

POST http://localhost:5000/api/auth/login

Test 3: Get current user (protected route)

GET http://localhost:5000/api/auth/me


# PHASE 5: Shop CRUD API (Shop-First Core Feature)
The shop endpoints

## 5.1 Create the Shop Controller
Create server/src/controllers/shopController.ts
```ts
import { Response } from 'express';
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
```

## 5.2 Create the Shop Routes
Create server/src/routes/shops.ts
```ts
import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  createShop,
  getMyShops,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop
} from '../controllers/shopController';

const router = Router();

// Validation rules
const createShopValidation = [
  body('name').notEmpty().withMessage('Shop name is required'),
  body('category').optional().isString(),
  body('description').optional().isString()
];

// Public routes
router.get('/', getAllShops);
router.get('/:id', getShopById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createShopValidation, createShop);
router.get('/my/shops', authMiddleware, getMyShops);
router.put('/:id', authMiddleware, updateShop);
router.delete('/:id', authMiddleware, deleteShop);

export default router;
```


## 5.3 Update the Main Index File
Update server/src/index.ts to include shop routes:
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import authRoutes from './routes/auth';
import shopRoutes from './routes/shops'; // Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes); // Add this

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sokohub API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🏪 Shops: http://localhost:${PORT}/api/shops`);
});
```

## 5.4 Test the Shop API
Test 1: Create a shop (requires auth token)
POST http://localhost:5000/api/shops

Test 2: Get all shops
GET http://localhost:5000/api/shops

Test 3: Get your shops
GET http://localhost:5000/api/shops/my/shops

Test 4: Get a specific shop
GET http://localhost:5000/api/shops/1

