"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const msg_1 = require("../controllers/msg");
const error_1 = require("../helpers/error");
const check_auth_1 = require("../middleware/check-auth");
const router = (0, express_1.Router)();
router.use(check_auth_1.checkAuth);
router.post('/send', [
    (0, express_validator_1.body)('phoneNumber').isLength({ min: 9, max: 9 }),
    (0, express_validator_1.body)('message').isString(),
    (0, express_validator_1.body)('token').isString(),
], msg_1.postMessage);
router.use(error_1.handleHttpError);
exports.default = router;
