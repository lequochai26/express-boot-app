import { Request, Response, NextFunction } from "express";
import ExpressBootContext from "./ExpressBootContext";
import Context from "./interfaces/Context";
import RequestDispatcher from "./interfaces/RequestDispatcher";
import ExpressBootHTTPMethod from "./types/ExpressBootHTTPMethod";
import ExpressBootRequestHandler from "./interfaces/ExpressBootRequestHandler";

@ExpressBootContext.node("requestDispatcher")
export default class ExpressBootRequestDispatcher implements RequestDispatcher {

    // Dependencies:
    private context(): Context {
        return null;
    }

    // Methods:
    public async dispatch(request: Request, response: Response, next: NextFunction, to: string, method: ExpressBootHTTPMethod): Promise<void> {
        // Get context
        const context: Context = this.context();

        // Get request handler
        const requestHandler: ExpressBootRequestHandler = context.getRequestHandler(to, method);

        // Request handler not found case
        if (!requestHandler) {
            throw new Error(`No request handler match ${to} path and ${method} method!`);
        }

        // Calling request handler
        requestHandler.handler(request, response, next);
    }

}