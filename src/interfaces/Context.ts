import { RequestHandler } from "express";
import ExpressBootHTTPMethod from "../types/ExpressBootHTTPMethod";
import ExpressBootRequestHandlerProvider from "../types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "../types/ExpressBootScript";
import ExpressBootNode from "./ExpressBootNode";
import ExpressBootRequestHandler from "./ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./ExpressBootRequestMiddleware";

/**
 * Represent the context of your ExpressBoot app
 */
export default interface Context {
    /**
     * Get a specific node in 
     * @param name Node name
     * @returns Node
     */
    getNode(name: string): any;

    /**
     * Get all nodes in system
     * @returns All nodes in system
     */
    getNodes(): ExpressBootNode[];

    /**
     * Register an object as a node
     * @param node Target
     * @param name Node name
     */
    registerNode(node: any, name: string): void;

    /**
     * Get all request handlers in system
     * @returns All request handlers in system
     */
    getRequestHandlers(): ExpressBootRequestHandler[];

    /**
     * Get request handler match given path and method in system.
     * @param path Request mapping path
     * @param method HTTP method
     */
    getRequestHandler(path: string, method: ExpressBootHTTPMethod): ExpressBootRequestHandler;

    /**
     * Get all request middlewares is system
     * @returns All request middlewares in system
     */
    getRequestMiddlewares(): ExpressBootRequestMiddleware[];

    /**
     * Get request middleware match given path in system.
     * @param path Request mapping path
     */
    getRequestMiddleware(path: string): ExpressBootRequestMiddleware;

    /**
     * Get CORS configurer
     * @returns CORS configurer if available
     */
    getCorsConfigurer(): ExpressBootRequestHandlerProvider;

    /**
     * Get Multer configurer
     * @returns Multer configurer if available
     */
    getMulterConfigurer(): ExpressBootRequestHandlerProvider;

    /**
     * Get all scripts in system
     * @returns All scripts in system
     */
    getScripts(): ExpressBootScript[];

    /**
     * Get request logger request handler provider
     * @returns Request logger handler provider
     */
    getRequestLogger(): RequestHandler;

    /**
     * Load context
     * @param path Sources path
     */
    load(path: string): Promise<void>;
}