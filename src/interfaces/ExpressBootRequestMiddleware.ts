import { RequestHandler } from "express";

export default interface ExpressBootRequestMiddleware {
    path: string;
    middleware: RequestHandler;
}