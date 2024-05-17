"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultLogger = function (request, response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
};
exports.default = defaultLogger;
//# sourceMappingURL=defaultLogger.js.map