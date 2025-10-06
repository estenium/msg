"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = void 0;
const error_1 = require("../helpers/error");
const http_1 = require("../helpers/http");
const logger_1 = __importDefault(require("../helpers/logger"));
const telegram_1 = require("../lib/telegram");
const recipientUsername = process.env.RECIPIENT_USERNAME || '';
const postMessage = async (req, res, next) => {
    if (!(0, http_1.isReqValid)(req, next))
        return;
    const { message } = req.body;
    try {
        const client = await (0, telegram_1.getTelegramClient)();
        await client.sendMessage(recipientUsername, {
            message: message,
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        logger_1.default.error('postMessage', error);
        if (error instanceof Error) {
            if (error.message.includes('PHONE_NUMBER_INVALID')) {
                return next(new error_1.HttpError('Invalid phone number or user not found on Telegram', 400));
            }
            if (error.message.includes('USER_IS_BLOCKED')) {
                return next(new error_1.HttpError('You have been blocked by this user', 403));
            }
            if (error.message.includes('Connection timeout')) {
                return next(new error_1.HttpError('Telegram connection timeout', 504));
            }
            if (error.message.includes('not authorized')) {
                return next(new error_1.HttpError('Telegram session expired. Please re-authenticate.', 401));
            }
        }
        return next(new error_1.HttpError('Unable to send a message.', 500));
    }
};
exports.postMessage = postMessage;
