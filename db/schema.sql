-- DemoShop Schema
-- Run this in Supabase SQL Editor

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  picture text,
  price_usd numeric(10,2) not null,
  categories text[]
);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  created_at timestamptz default now()
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null default 1,
  constraint positive_quantity check (quantity > 0)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  email text,
  shipping_address text,
  total_usd numeric(10,2),
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null,
  unit_price_usd numeric(10,2) not null
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  transaction_id text not null,
  amount_usd numeric(10,2),
  status text default 'success',
  created_at timestamptz default now()
);
