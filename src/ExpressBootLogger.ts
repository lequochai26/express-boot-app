import { bgCyan, bgRed, bgYellow } from "colors";
import ExpressBootContext from "./ExpressBootContext";
import Logger from "./interfaces/Logger";
import { NextFunction, Request, Response } from "express";

@ExpressBootContext.node("logger")
export default class ExpressBootLogger implements Logger {
    // Constructor:
    public constructor() {

    }

    // Private methods:
    private log(content: string, type: "INFO" | "WARNING" | "ERROR"): void {
        content = `${new Date().toLocaleTimeString("vi").padEnd(10)}${type.charAt(0).padEnd(3)}${content}`

        content = (
            type === 'INFO'
            ?
            bgCyan(content)
            :
            type === 'WARNING'
            ?
            bgYellow(content)
            :
            bgRed(content)
        );

        console.log(content);
    }

    // Methods:
    public info(content: string): void {
        this.log(content, "INFO");
    }

    public warning(content: string): void {
        this.log(content, "WARNING");
    }

    public error(content: string): void {
        this.log(content, "ERROR");
    }

    @ExpressBootContext.requestLogger
    public requestLog(request: Request, respone: Response, next: NextFunction) {
        this.info(`${request.method}: ${request.path}`);
        next();
    }
}