"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("./helpers/logger"));
const msg_1 = __importDefault(require("./routes/msg"));
const telegram_1 = require("./lib/telegram");
const API_PATH = `/api/v1`;
const PORT = process.env.PORT || 3000;
let httpServer = null;
const createApp = () => {
    const app = (0, express_1.default)();
    return app;
};
const configureMiddleware = (app) => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    app.use((0, compression_1.default)());
    app.set('trust proxy', 1);
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
    return app;
};
const configureRoutes = (app) => {
    app.use(`${API_PATH}/msg`, msg_1.default);
    app.use(`${API_PATH}/health`, (_req, res) => {
        res.status(200).json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: Date.now(),
        });
    });
    return app;
};
const configureErrorHandling = (app) => {
    app.use((_req, res) => {
        res.status(404).json({
            error: 'Not found',
            status: 404,
        });
    });
    app.use((err, _req, res) => {
        logger_1.default.error(`Unhandled error: ${err.message}`, { error: err });
        res.status(500).json({
            error: 'Internal server error',
            status: 500,
        });
    });
    return app;
};
const startServer = (app) => {
    const server = app.listen(PORT, () => {
        logger_1.default.info(`Server started on port ${PORT}`);
    });
    return server;
};
const setupShutdownHandlers = (server) => {
    const shutdown = async () => {
        logger_1.default.info('Shutting down server...');
        await (0, telegram_1.disconnectTelegramClient)();
        if (server) {
            await new Promise((resolve) => {
                server.close(() => {
                    logger_1.default.info('HTTP server closed');
                    resolve();
                });
            });
        }
        logger_1.default.info('Server closed');
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('uncaughtException', (error) => {
        logger_1.default.error('Uncaught exception', { error });
        shutdown();
    });
};
const run = async () => {
    try {
        const app = createApp();
        configureMiddleware(app);
        configureRoutes(app);
        configureErrorHandling(app);
        httpServer = startServer(app);
        setupShutdownHandlers(httpServer);
    }
    catch (error) {
        logger_1.default.error('Failed to start server', { error });
        process.exit(1);
    }
};
run().catch((error) => {
    logger_1.default.error('Unhandled error in startup', { error });
    process.exit(1);
});
