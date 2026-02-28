# Sakhi Fragrance House — Backend Structure & Implementation Guide

> **Purpose**: This document defines the complete backend architecture for the Sakhi Fragrance House e-commerce frontend. Use this as a detailed prompt/blueprint when building the backend later.

---

## 🏗️ Technology Stack (Recommended)

| Layer | Technology |
|---|---|
| **Database** | PostgreSQL (via Supabase / Lovable Cloud) |
| **Auth** | Supabase Auth (Email/Password, Google, Facebook OAuth) |
| **API** | Supabase Edge Functions (Deno/TypeScript) |
| **Storage** | Supabase Storage (product images, user avatars) |
| **Payments** | Razorpay / Stripe (UPI, Card, COD support) |
| **Email** | Resend / SendGrid (order confirmations, OTP) |
| **Hosting** | Lovable Cloud / Vercel |

---

## 📊 Database Schema

### 1. `profiles` (User Profiles)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Users can read/update only their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. `addresses` (User Addresses)

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home', -- Home, Office, Other
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Users manage only their own addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
```

### 3. `categories` (Product Categories)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- Warm, Sweet, Floral, Calming, Woody, Spicy, Fresh
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public read access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT TO anon, authenticated USING (true);
```

### 4. `products` (Product Catalog)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT, -- Rich text / markdown for product detail page
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2), -- Original price for showing discounts
  category_id UUID REFERENCES categories(id),
  sku TEXT UNIQUE,
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  weight_grams INT, -- For shipping calculation
  burn_time_hours INT, -- Candle-specific
  fragrance_notes TEXT[], -- Top, middle, base notes
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Public read for active products only
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
```

### 5. `product_images` (Multiple Images per Product)

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read images" ON product_images FOR SELECT USING (true);
```

### 6. `reviews` (Product Reviews)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false, -- Admin moderation
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
```

### 7. `carts` (Persistent Cart)

```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest carts
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  UNIQUE(cart_id, product_id)
);

ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart items" ON cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
);
```

### 8. `orders` (Order Management)

```sql
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'cod', 'netbanking', 'wallet');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE, -- ORD-2025-XXXXX
  user_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Shipping address (snapshot at order time)
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  
  -- Pricing
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_charge NUMERIC(10,2) DEFAULT 49,
  discount NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  
  -- Payment
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_id TEXT, -- Razorpay/Stripe payment ID
  
  -- Status
  status order_status DEFAULT 'pending',
  tracking_number TEXT,
  tracking_url TEXT,
  estimated_delivery DATE,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
```

### 9. `order_items` (Order Line Items)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL, -- Snapshot
  product_price NUMERIC(10,2) NOT NULL, -- Snapshot
  quantity INT NOT NULL CHECK (quantity > 0),
  total NUMERIC(10,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
);
```

### 10. `wishlists` (User Wishlist)

```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
```

### 11. `coupons` (Discount Codes)

```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2), -- Cap for percentage discounts
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = true);
```

### 12. `newsletter_subscribers`

```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
```

### 13. `contact_messages`

```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
```

---

## 🔧 Edge Functions (Serverless API)

### 1. `create-order`
- **Trigger**: User clicks "Place Order"
- **Logic**:
  1. Validate cart items & stock availability
  2. Calculate totals (subtotal + delivery - discount + tax)
  3. Generate order number (`ORD-2025-XXXXX`)
  4. Create order + order_items records
  5. Deduct stock quantities
  6. Clear user's cart
  7. If payment_method != COD → initiate Razorpay/Stripe payment
  8. Send order confirmation email
- **Returns**: `{ order_id, order_number, payment_url? }`

### 2. `verify-payment`
- **Trigger**: Payment gateway callback
- **Logic**:
  1. Verify payment signature (Razorpay/Stripe webhook)
  2. Update order `payment_status` to 'paid'
  3. Update order `status` to 'confirmed'
  4. Send payment confirmation email

### 3. `check-pincode`
- **Trigger**: User enters pincode on product page
- **Logic**:
  1. Check pincode against serviceable areas database/API
  2. Return estimated delivery date
  3. Return delivery charge
- **Returns**: `{ serviceable: boolean, estimated_days: number, delivery_charge: number }`

### 4. `apply-coupon`
- **Trigger**: User enters coupon code at checkout
- **Logic**:
  1. Validate coupon exists & is active
  2. Check validity period
  3. Check usage limit
  4. Calculate discount
- **Returns**: `{ valid: boolean, discount: number, message: string }`

### 5. `send-email`
- **Trigger**: Various events
- **Emails to send**:
  - Order confirmation
  - Shipping notification
  - Delivery confirmation
  - Password reset
  - Welcome email on signup
  - Newsletter
- **Provider**: Resend or SendGrid

### 6. `admin-update-order`
- **Trigger**: Admin panel actions
- **Logic**:
  1. Verify admin role
  2. Update order status
  3. Add tracking number/URL
  4. Send status update email to customer

---

## 🗄️ Storage Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `product-images` | All product photos | Public read |
| `category-images` | Category banners | Public read |
| `user-avatars` | Profile pictures | Authenticated read/write (own) |
| `brand-assets` | Logo, banners, hero images | Public read |

---

## 🔐 Authentication Flow

### Email/Password Signup
1. User fills registration form
2. Call `supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })`
3. Trigger creates profile automatically
4. Confirmation email sent
5. User redirected to verify email page

### Email/Password Login
1. Call `supabase.auth.signInWithPassword({ email, password })`
2. Store session, redirect to home

### Google / Facebook OAuth
1. Call `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. Configure redirect URLs in Supabase dashboard
3. Profile auto-created via trigger

### Password Reset
1. Call `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/reset-password' })`
2. User clicks link → lands on `/reset-password`
3. Call `supabase.auth.updateUser({ password: newPassword })`

---

## 👑 Admin Panel (Future)

### Required Admin Features
- **Dashboard**: Revenue, orders today, top products, low stock alerts
- **Products**: CRUD products, manage images, set featured
- **Orders**: View all orders, update status, add tracking
- **Customers**: View user list, order history
- **Coupons**: Create/manage discount codes
- **Reviews**: Approve/reject reviews
- **Newsletter**: Send campaigns
- **Contact Messages**: View & respond
- **Analytics**: Sales reports, category performance

### Admin Role Setup
```sql
-- Add role to profiles
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Admin policies (add to each table)
CREATE POLICY "Admins full access" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## 📬 Webhook Events

| Event | Action |
|---|---|
| `order.created` | Send confirmation email, notify admin |
| `order.shipped` | Send shipping email with tracking |
| `order.delivered` | Send delivery confirmation, request review |
| `payment.received` | Update order status |
| `payment.failed` | Notify user, hold order |
| `user.signup` | Send welcome email |
| `review.submitted` | Notify admin for moderation |

---

## 🚀 Implementation Prompt

> **Copy-paste this prompt when ready to build the backend:**
>
> "I have a Sakhi Fragrance House e-commerce frontend built with React + Tailwind CSS. Please implement the complete backend using Lovable Cloud with the following:
>
> 1. **Database**: Create all tables from BACKEND_STRUCTURE.md — profiles, addresses, categories, products, product_images, reviews, carts, cart_items, orders, order_items, wishlists, coupons, newsletter_subscribers, contact_messages. Include all RLS policies and triggers.
>
> 2. **Authentication**: Email/password signup/login with auto-profile creation. Add Google OAuth. Implement password reset with /reset-password page.
>
> 3. **Edge Functions**: create-order (validate stock, generate order number, calculate totals, clear cart), verify-payment, check-pincode, apply-coupon, send-email (order confirmation).
>
> 4. **Storage**: Create product-images and user-avatars buckets with appropriate access policies.
>
> 5. **Connect Frontend**: Replace all dummy data with real database queries. Replace CartContext localStorage with persistent cart. Connect login/register forms to Supabase Auth. Connect checkout to create-order function. Connect orders page to real order data.
>
> 6. **Seed Data**: Insert the 10 candle products with categories (Warm, Sweet, Floral, Calming, Woody, Spicy, Fresh) and dummy reviews.
>
> Please implement step by step, starting with database tables and auth, then edge functions, then frontend integration."

---

## 📋 Environment Variables / Secrets

| Secret | Purpose |
|---|---|
| `RAZORPAY_KEY_ID` | Payment gateway public key |
| `RAZORPAY_KEY_SECRET` | Payment gateway secret |
| `RESEND_API_KEY` | Email service |
| `SHIPROCKET_API_KEY` | Shipping/tracking (optional) |

---

*Last updated: February 2025*
*Frontend version: 1.0 (React + Tailwind + Framer Motion)*
