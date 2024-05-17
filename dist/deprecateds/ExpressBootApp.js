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
    // Private methods:
    async loadContext(context, sourceRoot) {
        await context.load(sourceRoot);
    }
    async executeScripts(context) {
        // Get all scripts in system
        const scripts = context.getScripts();
        for (const script of scripts) {
            script();
        }
    }
    async appConfigure(app, context) {
        // CORS
        const corsHandler = context.getCorsHandler();
        app.use((0, cors_1.default)(corsHandler && corsHandler.handler.call(corsHandler.target)));
        // JSON body parser
        app.use(express_1.default.json());
        // Multer
        const multerConfigurer = context.getMulterConfigurer();
        app.use(multerConfigurer
            ?
                multerConfigurer.configurer.call(multerConfigurer.target)
            :
                (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).any());
    }
    async applyRequestMiddlewares(app, context) {
        for (const [path, handler] of context.getRequestMiddlewares()) {
            app.use(path, handler);
        }
    }
    async applyRequestHandlers(app, context) {
        for (const [path, method, handler] of context.getRequestHandlers()) {
            switch (method) {
                case 'DELETE': {
                    app.delete(path, handler);
                    continue;
                }
                case 'GET': {
                    app.get(path, handler);
                    continue;
                }
                case 'HEAD': {
                    app.head(path, handler);
                    continue;
                }
                case 'OPTIONS': {
                    app.options(path, handler);
                    continue;
                }
                case 'PATCH': {
                    app.patch(path, handler);
                    continue;
                }
                case 'POST': {
                    app.post(path, handler);
                    continue;
                }
                case 'PUT': {
                    app.put(path, handler);
                }
            }
        }
    }
    async staticResourcesServe(app, staticResourcesPath) {
        app.use(express_1.default.static(staticResourcesPath));
    }
    // Methods:
    async started() {
        return this.server !== undefined;
    }
    async stop() {
        this.server.close();
        delete this.server;
        delete this.expressApp;
    }
    async start() {
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
            this.server = this.expressApp.listen(port, () => console.log(`${appName} started on port ${port}`));
            // Congiure app
            await this.appConfigure(this.expressApp, context);
            // Applying middlewares
            await this.applyRequestMiddlewares(this.expressApp, context);
            // Applying request handlers
            await this.applyRequestHandlers(this.expressApp, context);
            // Serving static resources
            await this.staticResourcesServe(this.expressApp, staticResourcesPath);
            // Return app and server
            return {
                app: this.expressApp,
                server: this.server
            };
        }
        catch (error) {
            if (await this.started()) {
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
    __metadata("design:returntype", ExpressBootContext_1.default)
], ExpressBootApp.prototype, "context", null);
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