# E-Commerce Application

A full-stack e-commerce application built with Next.js, Supabase, and TypeScript. Features role-based authentication, product management, shopping cart, order processing, and admin dashboard.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products by category with search and filtering
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Complete order placement with shipping information
- **Order Management**: View order history and track order status
- **User Profile**: Manage personal information and account settings

### Admin/Owner Features
- **Product Management**: Create, edit, delete, and manage product inventory
- **Order Management**: View all orders, update order status, and track fulfillment
- **Dashboard Analytics**: View sales statistics, revenue, and order metrics
- **Inventory Control**: Manage stock quantities and product availability

### Authentication & Security
- **Role-Based Access Control**: Customer and Owner roles with different permissions
- **Secure Authentication**: Email/password authentication via Supabase Auth
- **Row Level Security**: Database-level security policies for data protection
- **Protected Routes**: Route-level authentication guards

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS, shadcn/ui components
- **File Storage**: Vercel Blob for product images
- **Deployment**: Vercel

### Database Schema

#### Tables
- **profiles**: User profiles with role information
- **products**: Product catalog with inventory management
- **orders**: Order records with status tracking
- **order_items**: Individual items within orders
- **cart_items**: Temporary cart storage

#### Relationships
- Users have profiles with roles (customer/owner)
- Products belong to categories and have stock quantities
- Orders contain multiple order items
- Cart items are temporary and user-specific

## 📡 API Endpoints

### Authentication Routes
- `GET /auth/callback` - Handle OAuth callback and role-based redirects

### Product Management
- `GET /api/products` - Fetch all active products
  - Query params: `category` (optional)
  - Returns: Array of product objects
  - Access: Public (active products only)

### File Upload
- `POST /api/upload` - Upload product images to Vercel Blob
  - Body: FormData with file
  - Returns: `{ url, filename, size, type }`
  - Access: Authenticated users only

## 🔐 Role-Based Functionality

### Customer Role
**Pages Access:**
- `/shop` - Browse products
- `/cart` - Manage shopping cart
- `/checkout` - Complete purchases
- `/orders` - View order history
- `/orders/[id]` - View order details
- `/profile` - Manage profile

**Permissions:**
- View active products only
- Manage own cart items
- Create and view own orders
- Update own profile information

**Database Access:**
- Read: Own profile, active products, own orders, own cart
- Write: Own profile, own cart, own orders

### Owner Role
**Pages Access:**
- All customer pages plus:
- `/admin` - Admin dashboard with analytics
- `/admin/products` - Product management
- `/admin/products/new` - Add new products
- `/admin/products/[id]/edit` - Edit existing products
- `/admin/orders` - Order management

**Permissions:**
- Full product management (CRUD operations)
- View and manage all orders
- Update order status
- Access sales analytics and metrics
- Manage product inventory and availability

**Database Access:**
- Read: All data (products, orders, profiles)
- Write: Products, order status updates
- Admin: Product activation/deactivation, inventory management

## 🛡️ Security Features

### Row Level Security (RLS) Policies

#### Profiles Table
- Users can only view/update their own profile
- Automatic profile creation on user registration

#### Products Table
- Public read access for active products
- Owners have full CRUD access
- Customers cannot modify products

#### Orders Table
- Users see only their own orders
- Owners can view all orders
- Only owners can update order status

#### Cart Items Table
- Users can only manage their own cart
- Automatic cleanup on user deletion

### Authentication Guards
- **AuthGuard Component**: Protects routes requiring authentication
- **Role-based Guards**: Restrict access based on user role
- **Middleware Protection**: Server-side route protection
- **Session Management**: Automatic token refresh and validation

## 🎨 UI Components

### Shopping Components
- **ProductList**: Product grid with category filtering
- **CategoryFilter**: Sidebar category navigation
- **ShoppingHeader**: Navigation with cart count and user menu

### Cart & Checkout
- **CartItems**: Cart management with quantity updates
- **CheckoutForm**: Complete checkout process with address collection

### Order Management
- **OrderList**: User order history
- **OrderDetails**: Detailed order information
- **AdminOrderList**: Admin order management with status updates

### Admin Components
- **AdminDashboard**: Analytics dashboard with key metrics
- **ProductForm**: Create/edit product form with image upload
- **ProductEditForm**: Edit existing products

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ecommerce-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase integration**
   - Connect Supabase integration in Vercel project settings
   - Run the database schema script: `scripts/001_create_database_schema.sql`

4. **Set up Vercel Blob integration**
   - Connect Blob integration in Vercel project settings

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

### Environment Variables
The following environment variables are automatically configured through Vercel integrations:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

## 📊 Database Schema Details

### User Management
\`\`\`sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
\`\`\`

### Product Catalog
\`\`\`sql
products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
\`\`\`

### Order System
\`\`\`sql
orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP
)
\`\`\`

### Shopping Cart
\`\`\`sql
cart_items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP,
  UNIQUE(user_id, product_id)
)
\`\`\`

## 🔄 Order Status Flow

1. **pending** - Order placed, awaiting processing
2. **processing** - Order being prepared
3. **shipped** - Order dispatched
4. **delivered** - Order completed
5. **cancelled** - Order cancelled

## 📱 Responsive Design

- Mobile-first responsive design
- Optimized for all screen sizes
- Touch-friendly interface
- Progressive Web App capabilities

## 🛠️ Development

### Key Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure
\`\`\`
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin-only pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order management
│   └── shop/              # Product browsing
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── [feature-components]
├── lib/                  # Utility libraries
│   └── supabase/        # Supabase client configuration
├── scripts/             # Database scripts
└── middleware.ts        # Next.js middleware
\`\`\`

## 🚀 Deployment

The application is designed for deployment on Vercel with automatic integration setup:

1. Connect your repository to Vercel
2. Add Supabase and Blob integrations
3. Run database migration scripts
4. Deploy automatically on push to main branch

## 📄 License

This project is licensed under the MIT License.
