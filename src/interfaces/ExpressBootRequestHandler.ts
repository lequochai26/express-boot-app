import { RequestHandler } from "express";
import ExpressBootHTTPMethod from "../types/ExpressBootHTTPMethod";

export default interface ExpressBootRequestHandler {
    path: string;
    method: ExpressBootHTTPMethod;
    handler: RequestHandler;
}