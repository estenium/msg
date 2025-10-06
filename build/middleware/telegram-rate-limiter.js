"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramMessageLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.telegramMessageLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many messages sent. Please try again in a minute.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
});
