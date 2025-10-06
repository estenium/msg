"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpError = exports.HttpError = void 0;
const logger_1 = __importDefault(require("./logger"));
class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode;
    }
}
exports.HttpError = HttpError;
const handleHttpError = (err, req, res, next) => {
    logger_1.default.error('Error', err.message);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({
        error: {
            message: err.message,
            statusCode: err.code,
        },
    });
};
exports.handleHttpError = handleHttpError;
