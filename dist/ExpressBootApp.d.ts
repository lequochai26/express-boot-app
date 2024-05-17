/// <reference types="node" />
import { Express } from 'express';
import http from 'http';
import { App } from "./interfaces/App";
export default class ExpressBootApp implements App {
    static getInstance(): ExpressBootApp;
    private expressApp;
    private server;
    private context;
    private logger;
    private loadContext;
    private executeScripts;
    private appConfigure;
    private applyRequestMiddlewares;
    private applyRequestHandlers;
    private staticResourcesServe;
    started(): boolean;
    stop(): Promise<void>;
    start(): Promise<{
        app: Express;
        server: http.Server;
    }>;
    getExpressApp(): Express;
    getServer(): http.Server;
}
