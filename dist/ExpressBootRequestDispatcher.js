"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
let ExpressBootRequestDispatcher = class ExpressBootRequestDispatcher {
    // Dependencies:
    context() {
        return null;
    }
    // Methods:
    async dispatch(request, response, next, to, method) {
        // Get context
        const context = this.context();
        // Get request handler
        const requestHandler = context.getRequestHandler(to, method);
        // Request handler not found case
        if (!requestHandler) {
            throw new Error(`No request handler match ${to} path and ${method} method!`);
        }
        // Calling request handler
        requestHandler.handler(request, response, next);
    }
};
ExpressBootRequestDispatcher = __decorate([
    ExpressBootContext_1.default.node("requestDispatcher")
], ExpressBootRequestDispatcher);
exports.default = ExpressBootRequestDispatcher;
//# sourceMappingURL=ExpressBootRequestDispatcher.js.map