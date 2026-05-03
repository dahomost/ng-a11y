import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import type { Pool } from 'pg';
import { createContainer } from './container';
import { errorHandler } from './middleware/errorHandler';
import { createV1Router } from './routes/v1';
import { env } from './config/env';

/** Express application factory — keeps `index.ts` focused on process lifecycle */
export function createApp(pool: Pool) {
  const app = express();
  const container = createContainer(pool);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1', createV1Router(container));

  app.use(errorHandler);
  return app;
}
