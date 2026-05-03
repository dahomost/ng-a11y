import { createApp } from './app';
import { env } from './config/env';
import { pool } from './db/pool';

const app = createApp(pool);

const server = app.listen(env.port, () => {
  console.log(`Library API listening on port ${String(env.port)}`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}, closing server…`);
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
  await pool.end();
  process.exit(0);
}

void ['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    void shutdown(sig);
  });
});
