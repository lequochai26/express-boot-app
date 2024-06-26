import { RequestHandler } from "express";
import Context from "./interfaces/Context";
import ExpressBootNode from "./interfaces/ExpressBootNode";
import ExpressBootRequestHandler from "./interfaces/ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./interfaces/ExpressBootRequestMiddleware";
import ExpressBootHTTPMethod from "./types/ExpressBootHTTPMethod";
import ExpressBootRequestHandlerProvider from "./types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "./types/ExpressBootScript";
import fs from 'fs';
import Logger from "./interfaces/Logger";

@ExpressBootContext.node("context")
export default class ExpressBootContext implements Context {
    // Static fields:
    private static nodes: { [ index: string | symbol ]: any } = {};
    private static requestHandlers: ExpressBootRequestHandler[] = [];
    private static requestMiddlewares: { [ priority: number ]: ExpressBootRequestMiddleware[] } = {};
    private static corsConfigurer: ExpressBootRequestHandlerProvider;
    private static multerConfigurer: ExpressBootRequestHandlerProvider;
    private static scripts: { [ priority: number ]: ExpressBootScript[] } = {};
    private static requestLoggerHandler: RequestHandler;

    // Static dependencies:
    @ExpressBootContext.inject()
    private static logger(): Logger { return null; }

    // Decorators:
    /**
     * Mark a class as node class.
     * @param name Node name
     * @param args Class constructor arguments
     */
    public static node(name?: string, ...args: any[]): ClassDecorator {
        const evaluation: ClassDecorator = function (target: any) {
            if (!name) {
                name = target.name;
                name = name.replace(
                    name.charAt(0),
                    name.charAt(0).toLowerCase()
                );
            }
            ExpressBootContext.nodes[name] = new target(...args);

            ExpressBootContext.logger()
                ?.info(
                    `Instantiated node '${name}' of class '${target.name}'`
                );
        };
        return evaluation;
    }

    /**
     * Mark a method as a node generator method.
     * @param name Node name
     * @param dependencies Node names
     */
    public static configNode(name?: string, ...dependencies: (string | symbol)[]): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            ExpressBootContext.nodes[name || propertyKey] = descriptor.value.call(target, ...dependencies);

            ExpressBootContext.logger()
                ?.info(
                    `Received node '${String(name || propertyKey)}' from method '${String(propertyKey)}'`
                );
        };
        return evaluation;
    }

    /**
     * Inject a specific node matchs given name through marked method.
     * @param name Target node name
     */
    public static inject(name?: string): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor) {
            ExpressBootContext.logger()
                ?.info(
                    `Injected node '${String(name || propertyKey)}' into method '${String(propertyKey)}'`
                );

            return <any> {
                ...descriptor,
                value: function () {
                    return ExpressBootContext.nodes[name || propertyKey];
                }
            };
        };
        return evaluation;
    }

    /**
     * Mark a method as a request handler.
     * @param path Request mapping path
     * @param method HTTP method (undefined as middleware)
     * @param priority Execution priority (works for middlewares execution)
     */
    public static requestHandle(path: string, method?: ExpressBootHTTPMethod, priority = -1): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            const handler: RequestHandler = function (request, response, next) {
                descriptor.value.call(target, request, response, next);
            }

            if (!method) {
                if (!ExpressBootContext.requestMiddlewares[priority]) {
                    ExpressBootContext.requestMiddlewares[priority] = [];
                }
                ExpressBootContext.requestMiddlewares[priority].push({
                    path,
                    middleware: handler
                })
            }
            else {
                ExpressBootContext.requestHandlers.push({
                    path, method, handler
                });
            }

            ExpressBootContext.logger()
                ?.info(
                    `Detected a ${method ? "request handler" : "middleware"} from method '${String(propertyKey)}'`
                );
        };
        return evaluation;
    }

    /**
     * Mark a method as a GET request handler.
     * @param path Request mapping path
     */
    public static get(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'GET');
    }

    /**
     * Mark a method as a POST request handler.
     * @param path Request mapping path
     */
    public static post(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'POST');
    }

    /**
     * Mark a method as a PUT request handler.
     * @param path Request mapping path
     */
    public static put(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'PUT');
    }

    /**
     * Mark a method as a DELETE request handler.
     * @param path Request mapping path
     */
    public static delete(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'DELETE');
    }

    /**
     * Mark a method as a PATCH request handler.
     * @param path Request mapping path
     */
    public static patch(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'PATCH');
    }

    /**
     * Mark a method as a OPTIONS request handler.
     * @param path Request mapping path
     */
    public static options(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'OPTIONS');
    }

    /**
     * Mark a method as a HEAD request handler.
     * @param path Request mapping path
     */
    public static head(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'HEAD');
    }

    /**
     * Mark a method as a request middleware.
     * @param path Request mapping path
     * @param priority Execution priority
     */
    public static middleware(path: string, priority?: number) {
        return ExpressBootContext.requestHandle(path, undefined, priority);
    }

    /**
     * Mark a method as a CORS configurer.
     */
    public static cors<T extends ExpressBootRequestHandlerProvider>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
        ExpressBootContext.corsConfigurer = function () {
            ExpressBootContext.logger()
                ?.info(`Detected CORS configurer from  method '${String(propertyKey)}'`);
            return descriptor.value.call(target);
        };
    }

    /**
     * Mark a method as a Multer configurer.
     */
    public static multer<T extends ExpressBootRequestHandlerProvider>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
        ExpressBootContext.multerConfigurer = function () {
            ExpressBootContext.logger()
                ?.info(`Detected multer configurer from method '${String(propertyKey)}'`);
            return descriptor.value.call(target);
        };
    }

    /**
     * Mark a method as a script.
     * @param priority Execution priority
     * @param dependencies Node names
     * @returns 
     */
    public static script<T extends ExpressBootScript>(priority: number = -1, ...dependencies: (string | symbol)[]) {
        function evaluation(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
            if (!ExpressBootContext.scripts[priority]) {
                ExpressBootContext.scripts[priority] = [];
            }
            ExpressBootContext.scripts[priority].push(
                function () {
                    descriptor.value.call(target, ...dependencies.map(dependency => ExpressBootContext.nodes[dependency]));
                }
            );
            ExpressBootContext.logger()
                ?.info(`Detected a script from method '${String(propertyKey)}'`);
        };
        return evaluation;
    }

    /**
     * Mark a method as a request logger
     */
    public static requestLogger<T extends RequestHandler>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
        ExpressBootContext.requestLoggerHandler = function (request, response, next) {
            return descriptor.value.call(target, request, response, next);
        };
    }

    // Constructors:
    public constructor() {

    }

    // Methods:
    public getNode(name: string): any {
        return ExpressBootContext.nodes[name];
    }

    public getNodes(): ExpressBootNode[] {
        return Object.keys(ExpressBootContext.nodes)
            .map(
                name => ({
                    name,
                    value: ExpressBootContext.nodes[name]
                })
            );
    }

    public getRequestHandlers(): ExpressBootRequestHandler[] {
        return ExpressBootContext.requestHandlers;
    }

    public getRequestHandler(path: string, method: ExpressBootHTTPMethod): ExpressBootRequestHandler {
        return ExpressBootContext.requestHandlers.filter(
            handler => (handler.path === path && handler.method === method)
        )[0];
    }

    public getRequestMiddlewares(): ExpressBootRequestMiddleware[] {
        return <any> Object.keys(ExpressBootContext.requestMiddlewares)
            .map(
                priority => Number.parseInt(priority)
            )
            .map(
                (priority, index, array) => {
                    if (priority >= 0) {
                        return priority;
                    }

                    ExpressBootContext.requestMiddlewares[array.length] = ExpressBootContext.requestMiddlewares[priority];
                    delete ExpressBootContext.requestMiddlewares[priority];
                    return array.length;
                }
            )
            .sort(
                (a, b) => a - b
            )
            .map(
                priority => ExpressBootContext.requestMiddlewares[priority]
            )
            .flat(1);
    }

    public getRequestMiddleware(path: string): ExpressBootRequestMiddleware {
        return Object.keys(ExpressBootContext.requestMiddlewares)
            .map(
                str => Number.parseInt(str)
            )
            .map(
                priority => ExpressBootContext.requestMiddlewares[priority]
            )
            .flat(1)
            .filter(
                middleware => (middleware.path === path)
            )[0];
    }

    public getCorsConfigurer(): ExpressBootRequestHandlerProvider {
        return ExpressBootContext.corsConfigurer;
    }

    public getMulterConfigurer(): ExpressBootRequestHandlerProvider {
        return ExpressBootContext.multerConfigurer;
    }

    public getScripts(): ExpressBootScript[] {
        return Object.keys(ExpressBootContext.scripts)
            .map(
                str => Number.parseInt(str)
            )
            .map(
                (priority, index, array) => {
                    if (priority >= 0) {
                        return priority
                    }

                    ExpressBootContext.scripts[array.length] = ExpressBootContext.scripts[priority];
                    delete ExpressBootContext.scripts[priority];
                    return array.length
                }
            )
            .sort(
                (a, b) => a - b
            )
            .map(
                priority => ExpressBootContext.scripts[priority]
            )
            .flat(1);
    }

    public registerNode(node: any, name: string): void {
        if (!node) {
            throw new Error(`Target can't be undefined!`);
        }

        ExpressBootContext.nodes[name] = node;
    }

    public getRequestLogger(): RequestHandler {
        return ExpressBootContext.requestLoggerHandler;
    }

    public async load(path: string): Promise<void> {
        ExpressBootContext.logger()
            .info(`Context loading...`);

        const filePaths: string[] = fs.readdirSync(
            path, { encoding: null, recursive: true }
        );

        for (const filePath of filePaths) {
            if (
                !filePath.endsWith(".ts")
                &&
                !filePath.endsWith(".js")
            ) {
                continue;
            }

            await import(`${path}${!path.endsWith("/") ? "/": ""}${filePath}`);
            ExpressBootContext.logger()
                .info(`Context loading ${filePath}`);
        }

        ExpressBootContext.logger()
            .info(`Context loaded successfully!`);
    }
}