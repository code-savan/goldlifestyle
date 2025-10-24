--
-- Explanation:
-- If you enable Row Level Security (RLS) on a table in Supabase/Postgres,
-- then by default *nobody* can access or modify data in that table unless there is at least one policy
-- that allows it. In other words, RLS means every query is checked for permission.
--
-- If you add "public" policies that allow all actions (using (true)), then anyone with your anon key
-- (i.e. your frontend) can still fully read/write those tables, even when not signed in.
-- The *admin* doesn't have to be signed in—but if you later remove these permissive policies,
-- then only authorized users will be able to access data, as per your policies.
--
-- If you want *no form of auth*, you can either:
--  1. NOT enable row level security (do not use 'alter table ... enable row level security'), or
--  2. Enable RLS but provide wide-open policies (as shown below)
--
-- If you want zero restrictions (no RLS, no policies needed), just don't enable RLS on the tables.
-- For now, you can comment out or remove the RLS enabling statements below.

-- Products core
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  amount_cents integer not null check (amount_cents >= 0),
  primary_image_url text,
  sizes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Colors linked to product
create table if not exists product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_name text not null,
  color_hex text,
  created_at timestamptz not null default now()
);

-- Images linked to product (optionally tied to a color)
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  color_name text,
  created_at timestamptz not null default now()
);

-- Product comments
create table if not exists product_comments (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  author text,
  body text not null,
  created_at timestamptz not null default now()
);

-- Ensure named foreign keys exist (visible in Supabase UI) and add helpful indexes
do $$ begin
  alter table product_colors
    add constraint product_colors_product_id_fkey
    foreign key (product_id) references products(id) on delete cascade;
exception when duplicate_object then null; end $$;

do $$ begin
  alter table product_images
    add constraint product_images_product_id_fkey
    foreign key (product_id) references products(id) on delete cascade;
exception when duplicate_object then null; end $$;

create index if not exists idx_product_colors_product_id on product_colors(product_id);
create index if not exists idx_product_images_product_id on product_images(product_id);

-- Orders minimal scaffold
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending',
  total_cents integer not null default 0,
  shipping jsonb,
  items jsonb,
  tx_ref text,
  flw_transaction_id text,
  flw_status text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table products enable row level security;
alter table product_colors enable row level security;
alter table product_images enable row level security;
alter table product_comments enable row level security;
alter table orders enable row level security;

-- Open policies for admin prototype (no auth) - tighten later
do $$ begin
  create policy "public read products" on products for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public write products" on products for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public update products" on products for update using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read colors" on product_colors for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public write colors" on product_colors for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read images" on product_images for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public write images" on product_images for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read comments" on product_comments for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public write comments" on product_comments for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read orders" on orders for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public write orders" on orders for insert with check (true);
exception when duplicate_object then null; end $$;
