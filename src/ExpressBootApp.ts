import { config } from "dotenv";
import ExpressBootContext from "./ExpressBootContext";
import express, { Express } from 'express';
import http from 'http';
import multer from "multer";

// App config
config();
const port: string = process.env.PORT || "2205";
const sourceRoot: string | undefined = process.env.SOURCE_ROOT;
const appName: string = process.env.APP_NAME || "ExpressBoot App";
const staticResourcesPath: string = process.env.STATIC_RESOURCES_PATH || "./assets";

@ExpressBootContext.node("app")
export class ExpressBootApp {
    // Static dependencies:
    @ExpressBootContext.inject("app")
    public static getInstance(): ExpressBootApp {
        return null;
    }

    // Dependencies:
    @ExpressBootContext.inject()
    private context(): ExpressBootContext {
        return null;
    }

    // Private methods:
    private async loadContext(sourceRoot: string): Promise<ExpressBootContext> {
        const context = this.context();
        await context.load(sourceRoot);
        return context;
    }

    private async executeScripts(context: ExpressBootContext): Promise<void> {
        // Get all scripts in system
        const scripts = context.getScripts();
        for (const script of scripts) {
            script();
        }
    }

    private async appConfigure(app: Express): Promise<void> {
        // JSON body parser
        app.use(express.json());

        // Multer
        app.use(
            multer({ storage: multer.memoryStorage() }).any()
        );

        // CORS
        // Todo
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
    public async start(): Promise<{ app: Express, server: http.Server }> {
        // Source root undefined case
        if (!sourceRoot) {
            throw new Error("Please, specify SOURCE_ROOT before performing this action!");
        }

        // App declaration
        let app: Express;
        let server: http.Server;

        try {
            // Load context
            const context: ExpressBootContext = await this.loadContext(
                sourceRoot.startsWith("./")
                ?
                sourceRoot.replace("./", `${process.cwd()}/`)
                :
                sourceRoot
            );

            // Scripts execution
            await this.executeScripts(context);

            // Start app
            app = express();
            server = app.listen(
                port,
                () => console.log(`${appName} started on port ${port}`)
            );

            // Congiure app
            await this.appConfigure(app);

            // Applying middlewares
            await this.applyRequestMiddlewares(app, context);

            // Applying request handlers
            await this.applyRequestHandlers(app, context);

            // Serving static resources
            await this.staticResourcesServe(app, staticResourcesPath);

            // Return
            return { app, server };
        }
        catch (error: any) {
            if (server) {
                server.close();
            }
            throw error;
        }
    }

}