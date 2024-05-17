import { RequestHandler } from "express";
import Context from "./interfaces/Context";
import ExpressBootNode from "./interfaces/ExpressBootNode";
import ExpressBootRequestHandler from "./interfaces/ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./interfaces/ExpressBootRequestMiddleware";
import ExpressBootHTTPMethod from "./types/ExpressBootHTTPMethod";
import ExpressBootRequestHandlerProvider from "./types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "./types/ExpressBootScript";
export default class ExpressBootContext implements Context {
    private static nodes;
    private static requestHandlers;
    private static requestMiddlewares;
    private static corsConfigurer;
    private static multerConfigurer;
    private static scripts;
    private static requestLoggerHandler;
    private static logger;
    /**
     * Mark a class as node class.
     * @param name Node name
     * @param args Class constructor arguments
     */
    static node(name?: string, ...args: any[]): ClassDecorator;
    /**
     * Mark a method as a node generator method.
     * @param name Node name
     * @param dependencies Node names
     */
    static configNode(name?: string, ...dependencies: (string | symbol)[]): MethodDecorator;
    /**
     * Inject a specific node matchs given name through marked method.
     * @param name Target node name
     */
    static inject(name?: string): MethodDecorator;
    /**
     * Mark a method as a request handler.
     * @param path Request mapping path
     * @param method HTTP method (undefined as middleware)
     * @param priority Execution priority (works for middlewares execution)
     */
    static requestHandle(path: string, method?: ExpressBootHTTPMethod, priority?: number): MethodDecorator;
    /**
     * Mark a method as a GET request handler.
     * @param path Request mapping path
     */
    static get(path: string): MethodDecorator;
    /**
     * Mark a method as a POST request handler.
     * @param path Request mapping path
     */
    static post(path: string): MethodDecorator;
    /**
     * Mark a method as a PUT request handler.
     * @param path Request mapping path
     */
    static put(path: string): MethodDecorator;
    /**
     * Mark a method as a DELETE request handler.
     * @param path Request mapping path
     */
    static delete(path: string): MethodDecorator;
    /**
     * Mark a method as a PATCH request handler.
     * @param path Request mapping path
     */
    static patch(path: string): MethodDecorator;
    /**
     * Mark a method as a OPTIONS request handler.
     * @param path Request mapping path
     */
    static options(path: string): MethodDecorator;
    /**
     * Mark a method as a HEAD request handler.
     * @param path Request mapping path
     */
    static head(path: string): MethodDecorator;
    /**
     * Mark a method as a request middleware.
     * @param path Request mapping path
     * @param priority Execution priority
     */
    static middleware(path: string, priority?: number): MethodDecorator;
    /**
     * Mark a method as a CORS configurer.
     */
    static cors<T extends ExpressBootRequestHandlerProvider>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void;
    /**
     * Mark a method as a Multer configurer.
     */
    static multer<T extends ExpressBootRequestHandlerProvider>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void;
    /**
     * Mark a method as a script.
     * @param priority Execution priority
     * @param dependencies Node names
     * @returns
     */
    static script<T extends ExpressBootScript>(priority?: number, ...dependencies: (string | symbol)[]): (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void;
    /**
     * Mark a method as a request logger
     */
    static requestLogger<T extends RequestHandler>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void;
    constructor();
    getNode(name: string): any;
    getNodes(): ExpressBootNode[];
    getRequestHandlers(): ExpressBootRequestHandler[];
    getRequestHandler(path: string, method: ExpressBootHTTPMethod): ExpressBootRequestHandler;
    getRequestMiddlewares(): ExpressBootRequestMiddleware[];
    getRequestMiddleware(path: string): ExpressBootRequestMiddleware;
    getCorsConfigurer(): ExpressBootRequestHandlerProvider;
    getMulterConfigurer(): ExpressBootRequestHandlerProvider;
    getScripts(): ExpressBootScript[];
    registerNode(node: any, name: string): void;
    getRequestLogger(): RequestHandler;
    load(path: string): Promise<void>;
}
