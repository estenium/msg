"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = void 0;
const error_1 = require("../helpers/error");
const http_1 = require("../helpers/http");
const logger_1 = __importDefault(require("../helpers/logger"));
const postMessage = async (req, res, next) => {
    if (!(0, http_1.isReqValid)(req, next))
        return;
    const { phoneNumber, message } = req.body;
    const phoneNumWithCode = `+380${phoneNumber}`;
    try {
        res.status(201).json({
            data: {
                phoneNumber: phoneNumWithCode,
                message,
            },
        });
    }
    catch (err) {
        logger_1.default.error('postMessage', err);
        return next(new error_1.HttpError('Unable to send a message.', 500));
    }
};
exports.postMessage = postMessage;
