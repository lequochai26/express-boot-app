/// <reference types="cookie-parser" />
import Logger from "./interfaces/Logger";
import { NextFunction, Request, Response } from "express";
export default class ExpressBootLogger implements Logger {
    constructor();
    private log;
    info(content: string): void;
    warning(content: string): void;
    error(content: string): void;
    requestLog(request: Request, respone: Response, next: NextFunction): void;
}
