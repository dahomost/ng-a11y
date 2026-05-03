import pg from 'pg';
import { env } from '../config/env';

/** Shared PostgreSQL pool — repository layer acquires clients from here */
export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected PostgreSQL pool error', err);
});
