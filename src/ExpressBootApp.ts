import { config } from "dotenv";
import ExpressBootContext from "./ExpressBootContext";
import express, { Express, RequestHandler } from 'express';
import http from 'http';
import multer from "multer";
import cors from 'cors';
import Context from "./interfaces/Context";
import { App } from "./interfaces/App";
import cookieParser from "cookie-parser";
import Logger from "./interfaces/Logger";

// App config
config();
const port: string = process.env.PORT || "2205";
const sourceRoot: string | undefined = process.env.SOURCE_ROOT;
const appName: string = process.env.APP_NAME || "ExpressBoot App";
const staticResourcesPath: string = process.env.STATIC_RESOURCES_PATH || "./assets";

@ExpressBootContext.node("app")
export default class ExpressBootApp implements App {
    // Static dependencies:
    @ExpressBootContext.inject("app")
    public static getInstance(): ExpressBootApp {
        return null;
    }

    // Fields:
    private expressApp: Express;
    private server: http.Server;

    // Dependencies:
    @ExpressBootContext.inject()
    private context(): Context {
        return null;
    }

    @ExpressBootContext.inject()
    private logger(): Logger {
        return null;
    }

    // Private methods:
    private async loadContext(context: Context, sourceRoot: string): Promise<void> {
        await context.load(sourceRoot);
    }

    private async executeScripts(context: Context): Promise<void> {
        this.logger().info(`${appName}'s scripts executing...`);

        // Get all scripts in system
        const scripts = context.getScripts();
        for (const script of scripts) {
            script();
        }

        this.logger().info(`${appName}'s scripts executed successfully!`);
    }

    private async appConfigure(app: Express, context: Context): Promise<void> {
        // Start log
        this.logger().info(`${appName} configuring...`);

        // Logger
        const logger: RequestHandler = context.getRequestLogger()
        app.use(logger);

        // CORS
        const corsConfigurer = context.getCorsConfigurer();
        app.use(
            corsConfigurer ? corsConfigurer() : cors()
        );

        // Cookie parser
        app.use(cookieParser());

        // JSON body parser
        app.use(express.json());

        // Multer
        const multerConfigurer = context.getMulterConfigurer();
        app.use(
            multerConfigurer
            ?
            multerConfigurer()
            :
            multer({ storage: multer.memoryStorage() }).any()
        );

        // Success log
        this.logger().info(`${appName} configured successfully!`);
    }

    private async applyRequestMiddlewares(app: Express, context: Context): Promise<void> {
        this.logger().info(`${appName}'s request middlewares loading...`);

        for (const { path, middleware } of context.getRequestMiddlewares()) {
            app.use(path, middleware);
            this.logger().info(`${appName} loaded request middleware for path: ${path}`);
        }

        this.logger().info(`${appName}'s request middlewares loaded successfully!`);
    }

    private async applyRequestHandlers(app: Express, context: Context): Promise<void> {
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

        this.logger().info(`${appName}'s request handlers loaded successfully!`)
    }

    private async staticResourcesServe(app: Express, staticResourcesPath: string): Promise<void> {
        app.use(express.static(staticResourcesPath));
        this.logger().info(`${appName}'s static resources serve on ${staticResourcesPath} folder!`);
    }

    // Methods:
    public started(): boolean {
        return this.server !== undefined;
    }

    public async stop(): Promise<void> {
        this.server.close();

        delete this.server;
        delete this.expressApp;
    }

    public async start(): Promise<{ app: Express, server: http.Server }> {
        // Start logging
        this.logger().info(`${appName} starting...`);

        // Source root undefined case
        if (!sourceRoot) {
            throw new Error("Please, specify SOURCE_ROOT before performing this action!");
        }

        try {
            // Get context
            const context: ExpressBootContext = this.context();

            // Load context
            await this.loadContext(
                context,
                sourceRoot.startsWith("./")
                ?
                sourceRoot.replace("./", `${process.cwd()}/`)
                :
                sourceRoot
            );

            // Scripts execution
            await this.executeScripts(context);

            // Start app
            this.expressApp = express();
            this.server = this.expressApp.listen(
                port,
                () => this.logger().info(`${appName} listening on port ${port}`)
            );

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
        catch (error: any) {
            if (this.started()) {
                await this.stop();
            }
            throw error;
        }
    }

    public getExpressApp(): Express {
        return this.expressApp;
    }

    public getServer(): http.Server {
        return this.server;
    }

}