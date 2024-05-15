import { Express } from "express";
import http from 'http';

export interface App {
    start(): Promise<{ app: Express, server: http.Server }>;
    started(): boolean;
    stop(): Promise<void>;
}