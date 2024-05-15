import { RequestHandler } from "express";
import ExpressBootHTTPMethod from "./types/ExpressBootHTTPMethod";
import fs from 'fs';
import ExpressBootCorsHandler from "./types/ExpressBootCorsHandler";
import ExpressBootRequestHandlerProvider from "./types/ExpressBootRequestHandlerProvider";

/**
 * ExpressBoot app's context and node container support for dependency injection.
 */
@ExpressBootContext.node("context")
export default class ExpressBootContext {
    // STATIC
    // Static fields:
    /**
     * Nodes storage.
     */
    private static nodes: { [ index: string | symbol ]: any } = {};

    /**
     * HTTP request handlers storage
     */
    private static requestHandlers: [ string, ExpressBootHTTPMethod, RequestHandler ][] = [];

    /**
     * HTTP request middlewares storage
     */
    private static requestMiddlewares: [ string, RequestHandler ][] = [];

    /**
     * Executable scripts storage
     */
    private static scripts: (() => void)[] = [];

    /**
     * CORS handler
     */
    private static corsHandler: { target: Object, handler: ExpressBootCorsHandler } | undefined = undefined;

    /**
     * Multer configurer
     */
    private static multerConfigurer: { target: Object, configurer: ExpressBootRequestHandlerProvider } | undefined = undefined;

    // Decorators:
    /**
     * Define a node through class with node name as given
     * @param name - node name
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
        };
        return evaluation;
    }

    /**
     * Define a node through config method with node name as method's name
     * @param dependencies - dependencies will be inject into config methods
     */
    public static configNode(...dependencies: string[]): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            ExpressBootContext.nodes[propertyKey] = descriptor.value.call(
                target,
                ...dependencies.map(
                    dependency => ExpressBootContext.nodes[dependency]
                )
            );
            
            return {
                ...descriptor,
                value: function () {
                    return ExpressBootContext.nodes[propertyKey];
                }
            };
        }

        return evaluation;
    }

    /**
     * Inject dependency into method with method's name as node name.
     * @returns New method which will return dependency on call
     */
    public static inject(name?: string): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor) {
            return <any> {
                ...descriptor,
                value: function () {
                    return ExpressBootContext.nodes[name || propertyKey];
                }
            }
        }
        return evaluation;
    }

    /**
     * Mark a method as a request handler or a request middleware (if method is undefined)
     * @param path - Request's path mapping
     * @param method - HTTP method
     */
    public static requestHandle(path: string, method?: ExpressBootHTTPMethod): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            if (!path) {
                return;
            }

            const requestHandler: RequestHandler = function (request, response, next) {
                descriptor.value.call(target, request, response, next);
            }

            if (!method) {
                ExpressBootContext.requestMiddlewares.push([ path, requestHandler ]);
            }
            else {
                ExpressBootContext.requestHandlers.push([ path, method, requestHandler ]);
            }
        };
        return evaluation;
    }

    /**
     * GET request handler
     * @param path - Request's path mapping
     */
    public static get(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'GET');
    }

    /**
     * POST request handler
     * @param path - Request's path mapping
     */
    public static post(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'POST');
    }

    /**
     * PUT request handler
     * @param path - Request's path mapping
     */
    public static put(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'PUT');
    }

    /**
     * DELETE request handler
     * @param path - Request's path mapping
     */
    public static delete(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'DELETE');
    }

    /**
     * PATCH request handler
     * @param path - Request's path mapping
     */
    public static patch(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'PATCH');
    }

    /**
     * OPTIONS request handler
     * @param path - Request's path mapping
     */
    public static options(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'OPTIONS');
    }

    /**
     * HEAD request handler
     * @param path - Request's path mapping
     */
    public static head(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'HEAD');
    }

    /**
     * Request middleware
     * @param path Request's path mapping
     */
    public static middleware(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path);
    }

    /**
     * Mark a method as a CORS handler
     */
    public static cors<T extends ExpressBootCorsHandler>() {
        function evaluation (
            target: Object,
            propertyKey: string | symbol,
            descriptor: TypedPropertyDescriptor<T>
        ): void | TypedPropertyDescriptor<T> {
            ExpressBootContext.corsHandler = { target, handler: descriptor.value };
        };
        return evaluation;
    }

    /**
     * Mark a method as a multer configurer
     */
    public static multer<T extends ExpressBootRequestHandlerProvider>() {
        function evaluation(
            target: Object,
            propertyKey: string | symbol,
            descriptor: TypedPropertyDescriptor<T>
        ): void | TypedPropertyDescriptor<T> {
            ExpressBootContext.multerConfigurer = { target, configurer: descriptor.value };
        }
        return evaluation;
    }

    /**
     * Marks a method as an executable script and will be execute when context successfully loaded.
     */
    public static script(...dependencies: (string | symbol)[]): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            descriptor.value.call(
                target,
                ...dependencies.map(
                    dependency => ExpressBootContext.nodes[dependency]
                )
            );
        };
        return evaluation;
    }

    // INSTANCE
    // Constructors:
    public constructor() {

    }

    // Methods:
    /**
     * Get a specific node with given name
     * @param name Node name
     * @returns Node
     */
    public getNode(name: string): any {
        return ExpressBootContext.nodes[name];
    }

    /**
     * Get all nodes available in system
     * @returns List of all nodes in system
     */
    public getNodes(): any[] {
        return Object.values(
            ExpressBootContext.nodes
        );
    }

    /**
     * Get all request handlers in system
     * @returns List of all request handlers
     */
    public getRequestHandlers() {
        return ExpressBootContext.requestHandlers;
    }

    /**
     * Get all request middlewares in system
     * @returns List of all request middlewares
     */
    public getRequestMiddlewares() {
        return ExpressBootContext.requestMiddlewares;
    }

    /**
     * Get all scripts in system
     * @returns List of all scripts
     */
    public getScripts() {
        return ExpressBootContext.scripts;
    }

    /**
     * Get CORS handler for this project
     * @returns CORS handler
     */
    public getCorsHandler() {
        return ExpressBootContext.corsHandler;
    }

    /**
     * Get multer configurer for this project
     * @returns Multer configurer
     */
    public getMulterConfigurer() {
        return ExpressBootContext.multerConfigurer;
    }

    /**
     * Load context from a specific path
     * @param path Root directory source directory
     */
    public async load(path: string): Promise<void> {
        const dirs: string[] = fs.readdirSync(
            path,
            { encoding: null, recursive: true }
        );

        for (const dir of dirs) {
            if (!dir.endsWith(".ts")) {
                continue;
            }

            await import(`${path}${!path.endsWith("/") ? "/": ""}${dir}`);
        }
    }
}