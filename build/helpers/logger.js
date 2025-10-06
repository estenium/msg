"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    blue: '\x1b[36m%s\x1b[0m',
};
const logToConsole = (color, msg, data) => {
    console.log(color, msg, data ? data : '');
};
const logger = {
    success: (msg, data) => logToConsole(colors.green, msg, data),
    info: (msg, data) => logToConsole(colors.blue, `✔️ ${msg}`, data),
    warning: (msg, data) => logToConsole(colors.yellow, msg, data),
    error: (msg, data) => logToConsole(colors.red, `❌ ${msg}`, data),
};
exports.default = logger;
