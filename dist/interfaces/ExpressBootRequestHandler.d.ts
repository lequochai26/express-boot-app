import { RequestHandler } from "express";
import ExpressBootHTTPMethod from "../types/ExpressBootHTTPMethod";
/**
 * Represent a request handler in ExpressBoot system
 */
export default interface ExpressBootRequestHandler {
    /**
     * Request mapping path
     */
    path: string;
    /**
     * HTTP method
     */
    method: ExpressBootHTTPMethod;
    /**
     * Request handler function
     */
    handler: RequestHandler;
}
