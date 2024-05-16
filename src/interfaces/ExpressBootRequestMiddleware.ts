import { RequestHandler } from "express";

/**
 * Represent a request middleware in ExpressBoot system
 */
export default interface ExpressBootRequestMiddleware {
    /**
     * Request mapping path
     */
    path: string;

    /**
     * Request middleware function
     */
    middleware: RequestHandler;
}