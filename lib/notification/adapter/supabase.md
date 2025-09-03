### Supabase Adapter

This adapter stores listings in a Supabase table.

It uses the Supabase JavaScript client for inserts. Optionally, it can create the table if it does not exist when you provide a Postgres connection string for your Supabase project.

Steps:

1. In Supabase, create a project (if not already) and obtain:
   - Project URL (e.g. `https://xyzcompany.supabase.co`)
   - A key (Service Role recommended for server-side inserts, or anon if RLS policies allow)
   - Optional: Postgres connection string (e.g. `postgresql://USER:PASSWORD@db.xxx.supabase.co:5432/postgres?sslmode=require`)

2. Configure the adapter in Fredy with:
   - Supabase URL
   - Supabase Key
   - Table (default `listing`)
   - Postgres Connection String (optional, used to auto-create the table)

3. Table schema created (if connection string is provided):
   - serviceName TEXT
   - jobKey TEXT
   - id TEXT
   - size TEXT
   - rooms TEXT
   - price TEXT
   - address TEXT
   - title TEXT
   - link TEXT
   - description TEXT

Notes:
- If you do not provide the Postgres connection string, ensure the table exists beforehand.
- If you use the anon key, make sure Row Level Security policies allow inserts to the table.

