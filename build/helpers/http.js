"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReqValid = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("./error");
const handleHttpError = (errData, next) => {
    const errArray = errData.array();
    const result = [];
    errArray.forEach((error) => {
        if (error.type === 'alternative') {
            result.push(`There are ${error.nestedErrors.length} errors under this alternative list.`);
        }
        else if (error.type === 'field') {
            result.push(`${error.msg} '${error.value}' for '${error.path}'.`);
        }
    });
    const errorMessage = result.length ? result.join(' ') : `Check your data`;
    next(new error_1.HttpError(errorMessage, 400));
};
const isReqValid = (req, next) => {
    const errData = (0, express_validator_1.validationResult)(req);
    if (!errData.isEmpty()) {
        handleHttpError(errData, next);
        return false;
    }
    return true;
};
exports.isReqValid = isReqValid;
