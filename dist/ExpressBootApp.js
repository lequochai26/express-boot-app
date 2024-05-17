"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// App config
(0, dotenv_1.config)();
const port = process.env.PORT || "2205";
const sourceRoot = process.env.SOURCE_ROOT;
const appName = process.env.APP_NAME || "ExpressBoot App";
const staticResourcesPath = process.env.STATIC_RESOURCES_PATH || "./assets";
let ExpressBootApp = class ExpressBootApp {
    // Static dependencies:
    static getInstance() {
        return null;
    }
    // Fields:
    expressApp;
    server;
    // Dependencies:
    context() {
        return null;
    }
    logger() {
        return null;
    }
    // Private methods:
    async loadContext(context, sourceRoot) {
        await context.load(sourceRoot);
    }
    async executeScripts(context) {
        this.logger().info(`${appName}'s scripts executing...`);
        // Get all scripts in system
        const scripts = context.getScripts();
        for (const script of scripts) {
            script();
        }
        this.logger().info(`${appName}'s scripts executed successfully!`);
    }
    async appConfigure(app, context) {
        // Start log
        this.logger().info(`${appName} configuring...`);
        // Logger
        const logger = context.getRequestLogger();
        app.use(logger);
        // CORS
        const corsConfigurer = context.getCorsConfigurer();
        app.use(corsConfigurer ? corsConfigurer() : (0, cors_1.default)());
        // Cookie parser
        app.use((0, cookie_parser_1.default)());
        // JSON body parser
        app.use(express_1.default.json());
        // Multer
        const multerConfigurer = context.getMulterConfigurer();
        app.use(multerConfigurer
            ?
                multerConfigurer()
            :
                (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).any());
        // Success log
        this.logger().info(`${appName} configured successfully!`);
    }
    async applyRequestMiddlewares(app, context) {
        this.logger().info(`${appName}'s request middlewares loading...`);
        for (const { path, middleware } of context.getRequestMiddlewares()) {
            app.use(path, middleware);
            this.logger().info(`${appName} loaded request middleware for path: ${path}`);
        }
        this.logger().info(`${appName}'s request middlewares loaded successfully!`);
    }
    async applyRequestHandlers(app, context) {
        this.logger().info(`${appName}'s request handlers loading...`);
        for (const { path, method, handler } of context.getRequestHandlers()) {
            switch (method) {
                case 'DELETE': {
                    app.delete(path, handler);
                    break;
                }
                case 'GET': {
                    app.get(path, handler);
                    break;
                }
                case 'HEAD': {
                    app.head(path, handler);
                    break;
                }
                case 'OPTIONS': {
                    app.options(path, handler);
                    break;
                }
                case 'PATCH': {
                    app.patch(path, handler);
                    break;
                }
                case 'POST': {
                    app.post(path, handler);
                    break;
                }
                case 'PUT': {
                    app.put(path, handler);
                }
            }
            this.logger().info(`${appName} loaded request handler for path: ${path}, and method: ${method}`);
        }
        this.logger().info(`${appName}'s request handlers loaded successfully!`);
    }
    async staticResourcesServe(app, staticResourcesPath) {
        app.use(express_1.default.static(staticResourcesPath));
        this.logger().info(`${appName}'s static resources serve on ${staticResourcesPath} folder!`);
    }
    // Methods:
    started() {
        return this.server !== undefined;
    }
    async stop() {
        this.server.close();
        delete this.server;
        delete this.expressApp;
    }
    async start() {
        // Start logging
        this.logger().info(`${appName} starting...`);
        // Source root undefined case
        if (!sourceRoot) {
            throw new Error("Please, specify SOURCE_ROOT before performing this action!");
        }
        try {
            // Get context
            const context = this.context();
            // Load context
            await this.loadContext(context, sourceRoot.startsWith("./")
                ?
                    sourceRoot.replace("./", `${process.cwd()}/`)
                :
                    sourceRoot);
            // Scripts execution
            await this.executeScripts(context);
            // Start app
            this.expressApp = (0, express_1.default)();
            this.server = this.expressApp.listen(port, () => this.logger().info(`${appName} listening on port ${port}`));
            // Congiure app
            await this.appConfigure(this.expressApp, context);
            // Applying middlewares
            await this.applyRequestMiddlewares(this.expressApp, context);
            // Applying request handlers
            await this.applyRequestHandlers(this.expressApp, context);
            // Serving static resources
            await this.staticResourcesServe(this.expressApp, staticResourcesPath);
            // Finishing log
            this.logger().info(`${appName} started successfully on port ${port}!`);
            // Return app and server
            return {
                app: this.expressApp,
                server: this.server
            };
        }
        catch (error) {
            if (this.started()) {
                await this.stop();
            }
            throw error;
        }
    }
    getExpressApp() {
        return this.expressApp;
    }
    getServer() {
        return this.server;
    }
};
__decorate([
    ExpressBootContext_1.default.inject(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ExpressBootApp.prototype, "context", null);
__decorate([
    ExpressBootContext_1.default.inject(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ExpressBootApp.prototype, "logger", null);
__decorate([
    ExpressBootContext_1.default.inject("app"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", ExpressBootApp)
], ExpressBootApp, "getInstance", null);
ExpressBootApp = __decorate([
    ExpressBootContext_1.default.node("app")
], ExpressBootApp);
exports.default = ExpressBootApp;
//# sourceMappingURL=ExpressBootApp.js.map