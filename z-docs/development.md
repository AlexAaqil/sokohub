# Phase 1: Environment Setup
## 1. Install node.js and npm
Node.js run JS on your server (backend).

npm is like an app sotre for JS packages.

Run these command to ensure successful isntallation.
```bash
node --version
npm --version
```

## 2. Install PostgreSQL
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
```

Verify it worked:
```bash
# Connect to the database
sudo -u postgres psql -d sokohub_db

# You should see: sokohub_db=#

# Exit with: \q
```

## 3. Install VS Code extensions
Thunder Client (By Ranga Vadhineni) : lets you test APIs without leaving VS Code

PostgreSQL (by Chris Kolkman) : lets you run database queries directly


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
npm install react-route-dom axios
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

Test the setup:
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
