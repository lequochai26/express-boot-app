/// <reference types="node" />
import { Express } from "express";
import http from 'http';
/**
 * Represent the ExpressBoot's Application
 */
export interface App {
    /**
     * Start ExpressBoot app
     * @returns app, server
     */
    start(): Promise<{
        app: Express;
        server: http.Server;
    }>;
    /**
     * Check if this ExpressBoot app started
     * @returns started
     */
    started(): boolean;
    /**
     * Stop ExpressBoot app
     */
    stop(): Promise<void>;
}
