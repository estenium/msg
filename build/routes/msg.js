"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const msg_1 = require("../controllers/msg");
const error_1 = require("../helpers/error");
const check_auth_1 = require("../middleware/check-auth");
const telegram_rate_limiter_1 = require("../middleware/telegram-rate-limiter");
const router = (0, express_1.Router)();
router.use(check_auth_1.checkAuth);
router.post('/send', telegram_rate_limiter_1.telegramMessageLimiter, [
    (0, express_validator_1.body)('message')
        .isString()
        .withMessage('Message must be a string')
        .notEmpty()
        .withMessage('Message cannot be empty')
        .isLength({ max: 4096 })
        .withMessage('Message is too long (max 4096 characters)'),
    (0, express_validator_1.body)('token')
        .isString()
        .withMessage('Token must be a string')
        .notEmpty()
        .withMessage('Token is required'),
], msg_1.postMessage);
router.use(error_1.handleHttpError);
exports.default = router;
