/// <reference types="node" />
import { Express } from 'express';
import http from 'http';
export default class ExpressBootApp {
    static getInstance(): ExpressBootApp;
    private expressApp;
    private server;
    private context;
    private loadContext;
    private executeScripts;
    private appConfigure;
    private applyRequestMiddlewares;
    private applyRequestHandlers;
    private staticResourcesServe;
    started(): Promise<boolean>;
    stop(): Promise<void>;
    start(): Promise<{
        app: Express;
        server: http.Server;
    }>;
    getExpressApp(): Express;
    getServer(): http.Server;
}
