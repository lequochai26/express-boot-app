import { config } from "dotenv";
import ExpressBootContext from "./ExpressBootContext";
import express, { Express } from 'express';
import http from 'http';
import multer from "multer";
import cors from 'cors';

// App config
config();
const port: string = process.env.PORT || "2205";
const sourceRoot: string | undefined = process.env.SOURCE_ROOT;
const appName: string = process.env.APP_NAME || "ExpressBoot App";
const staticResourcesPath: string = process.env.STATIC_RESOURCES_PATH || "./assets";

@ExpressBootContext.node("app")
export default class ExpressBootApp {
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
    private context(): ExpressBootContext {
        return null;
    }

    // Private methods:
    private async loadContext(context: ExpressBootContext, sourceRoot: string): Promise<void> {
        await context.load(sourceRoot);
    }

    private async executeScripts(context: ExpressBootContext): Promise<void> {
        // Get all scripts in system
        const scripts = context.getScripts();
        for (const script of scripts) {
            script();
        }
    }

    private async appConfigure(app: Express): Promise<void> {
        // CORS
        const corsHandler = this.context().getCorsHandler();
        app.use(
            cors(corsHandler && corsHandler.handler.call(corsHandler.target))
        );

        // JSON body parser
        app.use(express.json());

        // Multer
        app.use(
            multer({ storage: multer.memoryStorage() }).any()
        );
    }

    private async applyRequestMiddlewares(app: Express, context: ExpressBootContext): Promise<void> {
        for (const [ path, handler ] of context.getRequestMiddlewares()) {
            app.use(path, handler);
        }
    }

    private async applyRequestHandlers(app: Express, context: ExpressBootContext): Promise<void> {
        for (const [ path, method, handler ] of context.getRequestHandlers()) {
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
    public async started(): Promise<boolean> {
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
            await this.appConfigure(this.expressApp);

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
            if (await this.started()) {
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