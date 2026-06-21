import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config, isProd } from './lib/config.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/index.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS — '*' in dev, explicit allow-list in production.
  const allowAll = config.corsOrigins.includes('*');
  app.use(
    cors({
      origin: allowAll ? true : config.corsOrigins,
      credentials: true,
    }),
  );

  app.use(morgan(isProd ? 'combined' : 'dev'));

  app.use(
    rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Health check — the frontend calls `${API_URL}/../health` => /health.
  const health = (_req: express.Request, res: express.Response) =>
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  app.get('/health', health);
  app.get('/healthz', health);

  app.use(config.apiPrefix, apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
