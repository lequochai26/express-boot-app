/// <reference types="qs" />
import { RequestHandler } from "express";
import ExpressBootHTTPMethod from "../types/ExpressBootHTTPMethod";
import ExpressBootCorsHandler from "./ExpressBootCorsHandler";
import ExpressBootRequestHandlerProvider from "../types/ExpressBootRequestHandlerProvider";
/**
 * ExpressBoot app's context and node container support for dependency injection.
 */
export default class ExpressBootContext {
    /**
     * Nodes storage.
     */
    private static nodes;
    /**
     * HTTP request handlers storage
     */
    private static requestHandlers;
    /**
     * HTTP request middlewares storage
     */
    private static requestMiddlewares;
    /**
     * Executable scripts storage
     */
    private static scripts;
    /**
     * CORS handler
     */
    private static corsHandler;
    /**
     * Multer configurer
     */
    private static multerConfigurer;
    /**
     * Define a node through class with node name as given
     * @param name - node name
     */
    static node(name?: string, ...args: any[]): ClassDecorator;
    /**
     * Define a node through config method with node name as method's name
     * @param dependencies - dependencies will be inject into config methods
     */
    static configNode(...dependencies: string[]): MethodDecorator;
    /**
     * Inject dependency into method with method's name as node name.
     * @returns New method which will return dependency on call
     */
    static inject(name?: string): MethodDecorator;
    /**
     * Mark a method as a request handler or a request middleware (if method is undefined)
     * @param path - Request's path mapping
     * @param method - HTTP method
     */
    static requestHandle(path: string, method?: ExpressBootHTTPMethod): MethodDecorator;
    /**
     * GET request handler
     * @param path - Request's path mapping
     */
    static get(path: string): MethodDecorator;
    /**
     * POST request handler
     * @param path - Request's path mapping
     */
    static post(path: string): MethodDecorator;
    /**
     * PUT request handler
     * @param path - Request's path mapping
     */
    static put(path: string): MethodDecorator;
    /**
     * DELETE request handler
     * @param path - Request's path mapping
     */
    static delete(path: string): MethodDecorator;
    /**
     * PATCH request handler
     * @param path - Request's path mapping
     */
    static patch(path: string): MethodDecorator;
    /**
     * OPTIONS request handler
     * @param path - Request's path mapping
     */
    static options(path: string): MethodDecorator;
    /**
     * HEAD request handler
     * @param path - Request's path mapping
     */
    static head(path: string): MethodDecorator;
    /**
     * Request middleware
     * @param path Request's path mapping
     */
    static middleware(path: string): MethodDecorator;
    /**
     * Mark a method as a CORS handler
     */
    static cors<T extends ExpressBootCorsHandler>(): (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<T>;
    /**
     * Mark a method as a multer configurer
     */
    static multer<T extends ExpressBootRequestHandlerProvider>(): (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<T>;
    /**
     * Marks a method as an executable script and will be execute when context successfully loaded.
     */
    static script(...dependencies: (string | symbol)[]): MethodDecorator;
    constructor();
    /**
     * Get a specific node with given name
     * @param name Node name
     * @returns Node
     */
    getNode(name: string): any;
    /**
     * Get all nodes available in system
     * @returns List of all nodes in system
     */
    getNodes(): any[];
    /**
     * Get all request handlers in system
     * @returns List of all request handlers
     */
    getRequestHandlers(): [string, ExpressBootHTTPMethod, RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>][];
    /**
     * Get all request middlewares in system
     * @returns List of all request middlewares
     */
    getRequestMiddlewares(): [string, RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>][];
    /**
     * Get all scripts in system
     * @returns List of all scripts
     */
    getScripts(): (() => void)[];
    /**
     * Get CORS handler for this project
     * @returns CORS handler
     */
    getCorsHandler(): {
        target: Object;
        handler: ExpressBootCorsHandler;
    };
    /**
     * Get multer configurer for this project
     * @returns Multer configurer
     */
    getMulterConfigurer(): {
        target: Object;
        configurer: ExpressBootRequestHandlerProvider;
    };
    /**
     * Load context from a specific path
     * @param path Root directory source directory
     */
    load(path: string): Promise<void>;
}
