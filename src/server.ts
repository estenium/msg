import compression from 'compression';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { Server } from 'http';

import logger from './helpers/logger';
import msgRoutes from './routes/msg';

const API_PATH = `/api/v1`;
const PORT = process.env.PORT || 3000;
let httpServer: Server | null = null;

const createApp = (): Application => {
  const app = express();
  return app;
};

const configureMiddleware = (app: Application): Application => {
  // Security middleware
  app.use(cors());

  // Request parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Performance middleware
  app.use(compression());

  // Trust the first proxy (Google Load Balancer)
  app.set('trust proxy', 1);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  return app;
};

const configureRoutes = (app: Application): Application => {
  // API Endpoints
  app.use(`${API_PATH}/msg`, msgRoutes);

  // Health check endpoint
  app.use(`${API_PATH}/health`, (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

  return app;
};

const configureErrorHandling = (app: Application): Application => {
  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      status: 404,
    });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response) => {
    logger.error(`Unhandled error: ${err.message}`, { error: err });

    res.status(500).json({
      error: 'Internal server error',
      status: 500,
    });
  });

  return app;
};

const startServer = (app: Application): Server => {
  const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });

  return server;
};

// Clean shutdown
const setupShutdownHandlers = (server: Server): void => {
  const shutdown = async (): Promise<void> => {
    logger.info('Shutting down server...');

    // Close HTTP server
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          logger.info('HTTP server closed');
          resolve();
        });
      });
    }

    logger.info('Server closed');
    process.exit(0);
  };

  // Handle different signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    shutdown();
  });
};

// Main function to run the server
const run = async (): Promise<void> => {
  try {
    // Create and configure the app
    const app = createApp();
    configureMiddleware(app);
    configureRoutes(app);
    configureErrorHandling(app);

    httpServer = startServer(app);
    setupShutdownHandlers(httpServer);
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Start the application
run().catch((error) => {
  logger.error('Unhandled error in startup', { error });
  process.exit(1);
});
