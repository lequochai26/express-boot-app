/// <reference types="cookie-parser" />
import { Request, Response, NextFunction } from "express";
import RequestDispatcher from "./interfaces/RequestDispatcher";
import ExpressBootHTTPMethod from "./types/ExpressBootHTTPMethod";
export default class ExpressBootRequestDispatcher implements RequestDispatcher {
    private context;
    dispatch(request: Request, response: Response, next: NextFunction, to: string, method: ExpressBootHTTPMethod): Promise<void>;
}
