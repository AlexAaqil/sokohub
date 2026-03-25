# Phase 1: Environment Setup
## 1.1 Install node.js and npm
Node.js run JS on your server (backend).

npm is like an app sotre for JS packages.

Run these command to ensure successful installation.
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

configure tailwind (`client/vite.config.ts`) by adding everything with:
```js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig ({
    plugins: [
        tailwindcss(),
    ],
})
```

Add tailwind to you css (`client/src/index.css`)
```css
@import "tailwindcss";
```

Test that it all works.
```bash
npm run dev
```

It should run when you go to: `http//localhost:5173`

## 2.3 Scafold the Express Backend with TypeScript
Go to the server folder and initialize a new Node.js project:
```bash
cd ../server
npm init -y
```

This creates `package.json` file with default values.

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

This create `tsconfig.json` which we then replace the contents with:
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

Update package.json scripts (`server/package.json`):

Replace the scripts sections with:
```js
"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon --exec ts-node src/index.ts",
  "build": "tsc",
  "clean": "rm -rf dist"
}
```

At the top of the `package.json` file add shema to avoid any warnings from vscode:
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

Create the main entry point `src/index.ts` and add the initial code as:
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

Create the db connection `src/db/index.ts`:
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

create the types `src/types/index.ts` and add initial types as:
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

Create a `.gitignore` file to protect secrets:
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

## 2.7 Initialize the git repository
In the project root folder:
```bash
git init
```

Create a `.gitignore` for the root
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

Create `server/src/middleware/auth.ts`:
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
Create `server/src/controllers/authController.ts`:
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
Create `server/src/routes/auth.ts`:
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
Update `server/src/index.ts` to include the auth routes:
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
Using httpie

Test 1: Register a new user
```bash
http POST http://localhost:5000/api/auth/register full_name="Test User" email="test@gmail.com" password="pass" role="seller"
```


Test 2: Login with the user
```bash
http POST http://localhost:5000/api/auth/login email="test@gmail.com" password="pass"
```

Test 3: Get current user (protected route)
```bash
http GET http://localhost:5000/api/auth/me Authorization:"Bearer YOUR_TOKEN"
```


# PHASE 5: Shop CRUD API (Shop-First Core Feature)
The shop endpoints

| Endpoint | Method | Test Result |
|----------|--------|-------------|
| `POST /api/shops` | Create shop | Created 2 shops successfully |
| `GET /api/shops` | Get all shops | Returns all active shops |
| `GET /api/shops/my/shops` | Get my shops | Returns user's shops |
| `GET /api/shops/:id` | Get shop by ID | Returns shop details |
| `PUT /api/shops/:id` | Update shop | Updated name/description |
| `DELETE /api/shops/:id` | Delete shop | Deleted shop ID 2 successfully |

## 5.1 Create the Shop Controller
Create `server/src/controllers/shopController.ts`
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
Create `server/src/routes/shops.ts`
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
Update `server/src/index.ts` to include shop routes:
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
```bash
http POST http://localhost:5000/api/shops Authorization:"Bearer YOUR_TOKEN" name="Test Shop" description="lorem ipsum" category="test"
```

Test 2: Get all shops
```bash
http GET http://localhost:5000/api/shops
```

Test 3: Get your shops
```bash
http GET http://localhost:5000/api/shops/my/shops Authorization:"Bearer YOUR_TOKEN"
```

Test 4: Get a specific shop
```bash
http GET http://localhost:5000/api/shops/1
```

Test 5: Update a shop
```bash
http PUT http://localhost:5000/api/shops/1 Authorization:"Bearer YOUR_TOKEN" name="Amani Botanics Updated" description="Premium handcrafted skincare"
```

Test 6: Delete a shop
```bash
http DELETE http://localhost:5000/api/shops/2 Authorization:"Bearer YOUR_TOKEN"
```

# PHASE 6: Product CRUD API
Product endpoints.

Product will be linked to shops.

| Endpoint | Method | Test Result |
|----------|--------|-------------|
| **Create** |
| `POST /api/products` | Create product | Created product ID 1 |
| **Read** |
| `GET /api/products` | Get all products | Returns all products |
| `GET /api/products/shop/1` | Get products by shop | Returns shop's products |
| `GET /api/products/1` | Get product by ID | Returns product with shop details |
| **Update** |
| `PUT /api/products/1` | Update product | Updated price and stock |
| **Delete** |
| `DELETE /api/products/2` | Delete product | Deleted test product |

## 6.1 Create the Product Controller
Create `server/src/controllers/productController.ts`
```ts
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
```

## 6.2 Create the Product Routes
Create `server/src/routes/products.ts`
```ts
import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  createProduct,
  getAllProducts,
  getProductsByShop,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = Router();

// Validation rules
const createProductValidation = [
  body('shop_id').isInt().withMessage('Shop ID is required'),
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discount_pct').optional().isInt({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('stock_qty').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
];

// Public routes
router.get('/', getAllProducts);
router.get('/shop/:shopId', getProductsByShop);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createProductValidation, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
```

## 6.3 Update the Main Index File
Update the main index file to include product routes.
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import authRoutes from './routes/auth';
import shopRoutes from './routes/shops';
import productRoutes from './routes/products'; // Add this

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
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes); // Add this

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sokohub API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🏪 Shops: http://localhost:${PORT}/api/shops`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
});
```

## 6.4 Test the Product API
Test 1: Create a product (use your shop_id = 1)
```bash
http POST http://localhost:5000/api/products Authorization:"Bearer YOUR_TOKEN" shop_id=1 name="Aloe Vera Serum" description="Hydrating serum with pure aloe vera" price=720 discount_pct=40 stock_qty=34 category="Skincare"
```

Test 2: Get all products
```bash
http GET http://localhost:5000/api/products
```

Test 3: Get products by shop
```bash
http GET http://localhost:5000/api/products/shop/1
```

Test 4: Get single product
```bash
http GET http://localhost:5000/api/products/1
```

Test 5: Update a product
```bash
http PUT http://localhost:5000/api/products/1 Authorization:"Bearer YOUR_TOKEN" price=680 stock_qty=28
```

Test 6: Delete a product
```bash
http DELETE http://localhost:5000/api/products/1 Authorization:"Bearer YOUR_TOKEN"
```

# PHASE 7: Order CRUD API
The Orders API will handle:
- Creating orders (with multiple products)
- Viewing order history (for customers and shop owners)
- Updating order status (pending → paid → shipped → delivered)
- Tracking order items

| Endpoint | Method | Test Result |
|----------|--------|-------------|
| **Create** |
| `POST /api/orders` | Create order | Order ID 1 created with 2 items |
| **Read** |
| `GET /api/orders/my-orders` | Customer orders | Returns customer's orders |
| `GET /api/orders/shop-orders` | Seller orders | Returns orders for seller's shops |
| `GET /api/orders/:id` | Get order by ID | Returns order with items |
| **Update** |
| `PUT /api/orders/:id/status` | Update status | Updates order fulfillment status |
| `PUT /api/orders/:id/payment` | Update payment | Updates payment status |

## 7.1 Create the Order Types
Add order-related types to `server/src/types/index.ts`
```ts
// Add these to your existing types file

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'mpesa' | 'card' | null;
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  created_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: Date;
}

export interface CreateOrderInput {
  items: {
    product_id: number;
    quantity: number;
  }[];
  payment_method?: 'mpesa' | 'card';
}
```

## 7.2 Create the Order Controller
Create `server/src/controllers/orderController.ts`
```ts
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
      `SELECT DISTINCT o.*, u.full_name as customer_name
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN shops s ON p.shop_id = s.id
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

// Update payment status (called after payment)
export const updatePaymentStatus = async (orderId: number, paymentStatus: string, paymentMethod: string) => {
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
```

## 7.3 Create the Order Routes
Create `server/src/routes/orders.ts`
```ts
import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController';

const router = Router();

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product_id').isInt().withMessage('Each item must have a product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Each item must have a positive quantity'),
  body('payment_method').optional().isIn(['mpesa', 'card']).withMessage('Invalid payment method')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

// All order routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', createOrderValidation, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/shop-orders', getShopOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateStatusValidation, updateOrderStatus);

export default router;
```

## 7.4 Update the Main Index File
Update `server/src/index.ts` to include orders routes
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db';
import authRoutes from './routes/auth';
import shopRoutes from './routes/shops';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders'; // Add this

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
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Add this

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sokohub API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🏪 Shops: http://localhost:${PORT}/api/shops`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`📋 Orders: http://localhost:${PORT}/api/orders`);
});
```

## 7.5 Test the Orders API
Test 1: Create an order
```bash
http POST http://localhost:5000/api/orders Authorization:"Bearer YOUR_TOKEN" items:='[{"product_id":1, "quantity":2}]' payment_method="mpesa"
```

Test 2: Get my orders
```bash
http GET http://localhost:5000/api/orders/my-orders Authorization:"Bearer YOUR_TOKEN"
```

Test 3: Get order by id
```bash
http GET http://localhost:5000/api/orders/1 Authorization:"Bearer YOUR_TOKEN"
```

Test 4: Update order status (as shop owner)
```bash
http PUT http://localhost:5000/api/orders/1/status Authorization:"Bearer YOUR_TOKEN" status="paid"
```

Test 5: Update the payment status
```bash
http PUT http://localhost:5000/api/orders/1/payment Authorization:"Bearer YOUR_TOKEN" payment_status="paid" payment_method="mpesa"
```

Test 5: Get shop orders (seller view)
```bash
http GET http://localhost:5000/api/orders/shop-orders Authorization:"Bearer YOUR_TOKEN"
```

Test 6: Verify stock reduction
```bash
http GET http://localhost:5000/api/products/1
```

# PHASE 8: Payment Integration (M-Pesa + Stripe)
- M-Pesa STK Push integration
- Stripe card payments
- Payment webhook handling
- Order status updates after successful payment

# PHASE 9: Frontend Development
- Customer-facing shop browsing
- Product listings and cart
- Shop owner dashboard
- Order management interface

# Phase 10: Reviews & Social Features
- Product and shop reviews
- Social posts and networking
- Shop following
