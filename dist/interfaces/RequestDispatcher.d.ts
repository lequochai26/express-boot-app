/// <reference types="cookie-parser" />
import { NextFunction, Request, Response } from "express";
import ExpressBootHTTPMethod from "../types/ExpressBootHTTPMethod";
/**
 * Request dispatcher
 */
export default interface RequestDispatcher {
    /**
     * Dispatching the request handling execution from a request handler to another.
     * @param request Request
     * @param response Response
     * @param next Next function
     * @param to Destination request handler's path
     * @param method HTTP method
     */
    dispatch(request: Request, response: Response, next: NextFunction, to: string, method: ExpressBootHTTPMethod): Promise<void>;
}
