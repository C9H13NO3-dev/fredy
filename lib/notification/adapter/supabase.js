import { markdown2Html } from '../../services/markdown.js';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const { Pool } = pg;

const fields = [
  'serviceName',
  'jobKey',
  'id',
  'size',
  'rooms',
  'price',
  'address',
  'title',
  'link',
  'description',
];

export const send = async ({ serviceName, newListings, notificationConfig, jobKey }) => {
  const { supabaseUrl, supabaseKey, table, databaseUrl } = notificationConfig.find(
    (adapter) => adapter.id === config.id,
  ).fields;

  const tableName = table || 'listing';

  // 1) Best-effort: ensure table exists using Postgres connection if provided
  if (databaseUrl) {
    const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
    const client = await pool.connect();
    try {
      await client.query(
        `CREATE TABLE IF NOT EXISTS "${tableName}" (${fields.map((f) => `"${f}" TEXT`).join(', ')});`,
      );
    } finally {
      client.release();
      await pool.end();
    }
  }

  // 2) Insert listings using Supabase JS
  const supabase = createClient(supabaseUrl, supabaseKey);
  const rows = newListings.map((listing) => {
    const row = {};
    for (const f of fields) {
      if (f === 'serviceName') row[f] = serviceName;
      else if (f === 'jobKey') row[f] = jobKey;
      else row[f] = listing[f];
    }
    return row;
  });

  // Insert in chunks to avoid payload limits
  const chunkSize = 500;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(tableName).insert(chunk);
    if (error) throw error;
  }

  return Promise.resolve();
};

export const config = {
  id: 'supabase',
  name: 'Supabase',
  description:
    'This adapter stores listings in a Supabase table. It can optionally create the table using a Postgres connection string.',
  fields: {
    supabaseUrl: {
      type: 'text',
      label: 'Supabase URL',
      description: 'Project URL (e.g. https://xyzcompany.supabase.co).',
    },
    supabaseKey: {
      type: 'password',
      label: 'Supabase Key',
      description: 'Service Role or anon key with insert access to the table.',
    },
    table: {
      type: 'text',
      label: 'Table',
      description: 'Table where listings will be stored (default: listing).',
    },
    databaseUrl: {
      type: 'password',
      label: 'Postgres Connection String (optional)',
      description:
        'If provided, used to create the table if missing. Example: postgresql://user:pass@host:5432/postgres?sslmode=require',
    },
  },
  readme: markdown2Html('lib/notification/adapter/supabase.md'),
};

