"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTelegramClient = getTelegramClient;
exports.disconnectTelegramClient = disconnectTelegramClient;
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const logger_1 = __importDefault(require("../helpers/logger"));
const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH || '';
const sessionString = process.env.TELEGRAM_SESSION || '';
let client = null;
async function getTelegramClient() {
    if (!sessionString || !apiId || !apiHash) {
        throw new Error('Required environment variables have not been set');
    }
    if (client?.connected) {
        return client;
    }
    if (client) {
        await disconnectTelegramClient();
    }
    const session = new sessions_1.StringSession(sessionString);
    client = new telegram_1.TelegramClient(session, apiId, apiHash, {
        connectionRetries: 3,
        useWSS: true,
    });
    await client.start({
        phoneNumber: async () => {
            throw new Error('Session is invalid - authentication required');
        },
        password: async () => {
            throw new Error('Session is invalid - 2FA required');
        },
        phoneCode: async () => {
            throw new Error('Session is invalid - verification code required');
        },
        onError: (err) => console.log(err),
    });
    logger_1.default.info('Telegram client connected');
    return client;
}
async function disconnectTelegramClient() {
    if (client === null)
        return;
    try {
        await client.disconnect();
        logger_1.default.info('Telegram client disconnected');
    }
    catch (error) {
        logger_1.default.error('Error disconnecting telegram client', { error });
    }
    client = null;
}
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, disconnecting Telegram client...');
    await disconnectTelegramClient();
});
