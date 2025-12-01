-- ============================================
-- RADARPRO DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- USERS TABLE
-- Extends Supabase auth.users with profile data
create table if not exists users (
  id uuid references auth.users not null primary key,
  full_name text,
  email text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb
);

alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CUSTOMERS TABLE
-- Maps user IDs to Stripe customer IDs (private)
create table if not exists customers (
  id uuid references auth.users not null primary key,
  stripe_customer_id text
);

alter table customers enable row level security;
-- No select policy - accessed only via service role

-- PRODUCTS TABLE
-- Synced from Stripe via webhook
do $$ begin
  create type pricing_type as enum ('one_time', 'recurring');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
exception when duplicate_object then null;
end $$;

create table if not exists products (
  id text primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);

alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

-- PRICES TABLE
-- Synced from Stripe via webhook
create table if not exists prices (
  id text primary key,
  product_id text references products,
  active boolean,
  description text,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type pricing_type,
  interval pricing_plan_interval,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);

alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

-- SUBSCRIPTIONS TABLE
-- Synced from Stripe via webhook
do $$ begin
  create type subscription_status as enum (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused'
  );
exception when duplicate_object then null;
end $$;

create table if not exists subscriptions (
  id text primary key,
  user_id uuid references auth.users not null,
  status subscription_status,
  metadata jsonb,
  price_id text references prices,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  trial_end timestamp with time zone default timezone('utc'::text, now())
);

alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);

-- ============================================
-- RADARPRO-SPECIFIC TABLES
-- ============================================

-- Saved locations
create table if not exists saved_locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  slug text not null,
  lat decimal not null,
  lng decimal not null,
  radar_id text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table saved_locations enable row level security;
create policy "Users can view own locations." on saved_locations for select using (auth.uid() = user_id);
create policy "Users can insert own locations." on saved_locations for insert with check (auth.uid() = user_id);
create policy "Users can update own locations." on saved_locations for update using (auth.uid() = user_id);
create policy "Users can delete own locations." on saved_locations for delete using (auth.uid() = user_id);

-- Push subscriptions
create table if not exists push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  endpoint text unique not null,
  keys jsonb not null,
  location_slug text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table push_subscriptions enable row level security;
create policy "Users can manage own push subs." on push_subscriptions for all using (auth.uid() = user_id);

-- User preferences
create table if not exists preferences (
  user_id uuid references auth.users on delete cascade primary key,
  temp_unit text default 'C' check (temp_unit in ('C', 'F')),
  wind_unit text default 'kmh' check (wind_unit in ('kmh', 'mph')),
  default_range integer default 128,
  rain_alerts boolean default true,
  severe_alerts boolean default true,
  daily_forecast boolean default false,
  alert_timing integer default 15,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table preferences enable row level security;
create policy "Users can manage own preferences." on preferences for all using (auth.uid() = user_id);

-- Enable realtime for products/prices (optional)
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;
