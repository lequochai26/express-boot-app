/// <reference types="cookie-parser" />
import SessionFactory from "./interfaces/SessionFactory";
import { Request, Response } from "express";
export default class ExpressBootSessionFactory implements SessionFactory {
    private sessions;
    private idGenerator;
    constructor();
    private generateId;
    create(): [string, any];
    get(sessionId: string): any;
    retrieve(request: Request, response: Response): any;
}
