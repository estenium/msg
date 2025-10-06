"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const error_1 = require("../helpers/error");
const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS')
        return next();
    const handleUnauthenticated = () => {
        return next(new error_1.HttpError('Authentication failed', 401));
    };
    const authHeader = req.headers['authorization'];
    let token;
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
    }
    else if (authHeader) {
        token = authHeader.trim();
    }
    if (!token && req.method === 'POST') {
        token = req.body?.token;
    }
    if (!token || token !== process.env.API_ACCESS_TOKEN) {
        return handleUnauthenticated();
    }
    next();
};
exports.checkAuth = checkAuth;
