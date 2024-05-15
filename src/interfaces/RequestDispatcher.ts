import { NextFunction, Request, Response } from "express";
import ExpressBootHTTPMethod from "../types/ExpressBootHTTPMethod";

export default interface RequestDispatcher {
    dispatch(request: Request, response: Response, next: NextFunction, to: string, method: ExpressBootHTTPMethod): Promise<void>;
}