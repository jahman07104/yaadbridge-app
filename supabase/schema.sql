-- YardBridge Consulting — Database Schema
-- Paste this into: https://supabase.com/dashboard → SQL Editor → New query

create table if not exists hero_intakes (
  id uuid primary key default gen_random_uuid(),
  name text not null, origin text, month text, items text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text, origin text not null,
  rooms int, volume text, goods_notes text, notes text,
  vehicles jsonb default '[]', tools jsonb default '[]',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, session_type text,
  slot text not null, slot_label text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null, author_name text not null, body text not null,
  is_approved boolean default false,
  created_at timestamptz default now()
);
create index if not exists comments_post_id_idx on comments(post_id);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  category text not null, title text not null, body text not null,
  author_name text, replies_count int default 0,
  created_at timestamptz default now()
);
create index if not exists topics_category_idx on topics(category);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('offer','need')),
  category text not null, category_label text,
  title text not null, description text not null, contact text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists listings_category_idx on listings(category);

-- Row Level Security
alter table hero_intakes enable row level security;
alter table quotes enable row level security;
alter table bookings enable row level security;
alter table contacts enable row level security;
alter table comments enable row level security;
alter table topics enable row level security;
alter table listings enable row level security;

-- Public read policies
create policy "Public read approved comments" on comments for select using (is_approved = true);
create policy "Public read topics" on topics for select using (true);
create policy "Public read active listings" on listings for select using (is_active = true);
