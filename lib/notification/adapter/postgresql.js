import { markdown2Html } from '../../services/markdown.js';
import pg from 'pg';

const { Pool } = pg;

export const send = async ({ serviceName, newListings, notificationConfig, jobKey }) => {
  const { host, port, database, user, password, table } = notificationConfig.find(
    (adapter) => adapter.id === config.id,
  ).fields;

  const pool = new Pool({
    host,
    port: port ? parseInt(port, 10) : undefined,
    database,
    user,
    password,
  });

  const client = await pool.connect();
  try {
    const fields = ['serviceName', 'jobKey', 'id', 'size', 'rooms', 'price', 'address', 'title', 'link', 'description'];
    const tableName = table || 'listing';
    await client.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (${fields.map((f) => `"${f}" TEXT`).join(', ')});`);
    const insertQuery = `INSERT INTO "${tableName}" (${fields
      .map((f) => `"${f}"`)
      .join(', ')}) VALUES (${fields.map((_, idx) => `$${idx + 1}`).join(', ')})`;
    for (const listing of newListings) {
      const values = [
        serviceName,
        jobKey,
        listing.id,
        listing.size,
        listing.rooms,
        listing.price,
        listing.address,
        listing.title,
        listing.link,
        listing.description,
      ];
      await client.query(insertQuery, values);
    }
  } finally {
    client.release();
    await pool.end();
  }
  return Promise.resolve();
};

export const config = {
  id: 'postgresql',
  name: 'PostgreSQL',
  description: 'This adapter stores listings in a PostgreSQL database.',
  fields: {
    host: {
      type: 'text',
      label: 'Host',
      description: 'The PostgreSQL server host.',
    },
    port: {
      type: 'text',
      label: 'Port',
      description: 'The PostgreSQL server port.',
    },
    database: {
      type: 'text',
      label: 'Database',
      description: 'Name of the database to use.',
    },
    user: {
      type: 'text',
      label: 'User',
      description: 'Database user.',
    },
    password: {
      type: 'password',
      label: 'Password',
      description: 'Password for the database user.',
    },
    table: {
      type: 'text',
      label: 'Table',
      description: 'Table where listings will be stored.',
    },
  },
  readme: markdown2Html('lib/notification/adapter/postgresql.md'),
};
