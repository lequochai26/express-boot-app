import ExpressBootRequestHandlerProvider from "../types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "../types/ExpressBootScript";
import ExpressBootNode from "./ExpressBootNode";
import ExpressBootRequestHandler from "./ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./ExpressBootRequestMiddleware";

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
     * Get all request middlewares is system
     * @returns All request middlewares in system
     */
    getRequestMiddlewares(): ExpressBootRequestMiddleware[];

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
     * Load context
     * @param path Sources path
     */
    load(path: string): Promise<void>;
}