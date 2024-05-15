import { config } from "dotenv";
import ExpressBootContext from "./ExpressBootContext";
import express, { Express, RequestHandler } from 'express';
import http from 'http';
import multer from "multer";
import cors from 'cors';
import Context from "./interfaces/Context";
import { App } from "./interfaces/App";
import defaultLogger from "./defaultLogger";

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

    // Private methods:
    private async loadContext(context: Context, sourceRoot: string): Promise<void> {
        await context.load(sourceRoot);
    }

    private async executeScripts(context: Context): Promise<void> {
        // Get all scripts in system
        const scripts = context.getScripts();
        for (const script of scripts) {
            script();
        }
    }

    private async appConfigure(app: Express, context: Context): Promise<void> {
        // Logger
        const logger: RequestHandler = context.getLoggerHandler() || defaultLogger;
        app.use(logger);

        // CORS
        const corsConfigurer = context.getCorsConfigurer();
        app.use(
            corsConfigurer ? corsConfigurer() : cors()
        );

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
    }

    private async applyRequestMiddlewares(app: Express, context: Context): Promise<void> {
        for (const { path, middleware } of context.getRequestMiddlewares()) {
            app.use(path, middleware);
        }
    }

    private async applyRequestHandlers(app: Express, context: Context): Promise<void> {
        for (const { path, method, handler } of context.getRequestHandlers()) {
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

    private async staticResourcesServe(app: Express, staticResourcesPath: string): Promise<void> {
        app.use(express.static(staticResourcesPath));
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
                () => console.log(`${appName} started on port ${port}`)
            );

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